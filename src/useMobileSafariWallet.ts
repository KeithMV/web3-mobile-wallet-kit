import { useEffect, useState, useRef } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

// Check if we're on mobile Safari
function isMobileSafari() {
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod/i.test(ua) && /Safari/i.test(ua) && !/Chrome|CriOS/i.test(ua);
}

export function useMobileSafariWallet() {
  const { address, isConnected } = useAccount();
  const { connect: wagmiConnect, connectors } = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  
  const [connecting, setConnecting] = useState(false);
  const retryRef = useRef(false);

  // Safari fix: handle visibility changes when user returns from wallet
  useEffect(() => {
    if (!isMobileSafari() || !connecting) return;

    function handleVisibilityChange() {
      if (!document.hidden && connecting && !isConnected) {
        // User came back from MetaMask, give it a sec to connect
        setTimeout(() => {
          if (!isConnected && !retryRef.current) {
            // Still not connected, might need to retry
            // TODO: figure out if we should auto-retry or just show message
            console.log('Connection incomplete after returning from wallet');
          }
        }, 2000);
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
