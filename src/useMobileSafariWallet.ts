import { useEffect, useState, useRef } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { MobileSafariWalletReturn, MobileSafariWalletOptions } from './types';

// Check if we're on mobile Safari
function isMobileSafari() {
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod/i.test(ua) && /Safari/i.test(ua) && !/Chrome|CriOS/i.test(ua);
}

export function useMobileSafariWallet(
  options: MobileSafariWalletOptions = {}
): MobileSafariWalletReturn {
  const { autoRetry = true, retryDelay = 2000, onConnectionFailed } = options;
  
  const { address, isConnected } = useAccount();
  const { connect: wagmiConnect, connectors } = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  
  const [connecting, setConnecting] = useState(false);
  const retryRef = useRef(false);
  const connectAttemptRef = useRef(0);

  // Safari fix: handle visibility changes when user returns from wallet
  useEffect(() => {
    if (!isMobileSafari() || !connecting) return;

    function handleVisibilityChange() {
      if (!document.hidden && connecting && !isConnected) {
        // User came back from MetaMask, give it a sec to connect
        setTimeout(() => {
          if (!isConnected && !retryRef.current) {
            if (autoRetry && connectAttemptRef.current < 2) {
              // Auto-retry once
              console.log('Connection incomplete, retrying...');
              retryRef.current = true;
              connectAttemptRef.current++;
              handleConnect();
            } else {
              // Max retries reached or auto-retry disabled
              console.log('Connection failed after retry');
              setConnecting(false);
              if (onConnectionFailed) {
                onConnectionFailed();
              }
            }
          }
        }, retryDelay);
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [connecting, isConnected]);

  // Reset state when connected
  useEffect(() => {
    if (isConnected) {
      setConnecting(false);
      retryRef.current = false;
      connectAttemptRef.current = 0;
    }
  }, [isConnected]);

  function handleConnect() {
    setConnecting(true);
    const connector = connectors[0]; // just use first one for now
    if (connector) {
      wagmiConnect({ connector });
    }
  }

  function handleDisconnect() {
    setConnecting(false);
    retryRef.current = false;
    connectAttemptRef.current = 0;
    wagmiDisconnect();
  }

  return {
    address,
    isConnected,
    connecting,
    connect: handleConnect,
    disconnect: handleDisconnect,
    isMobile: isMobileSafari(),
  };
}
