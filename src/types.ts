/**
 * Return type for useMobileSafariWallet hook
 */
export interface MobileSafariWalletReturn {
  /** Connected wallet address */
  address: `0x${string}` | undefined;
  /** Whether wallet is connected */
  isConnected: boolean;
  /** Whether connection is in progress */
  connecting: boolean;
  /** Function to initiate wallet connection */
  connect: () => void;
  /** Function to disconnect wallet */
  disconnect: () => void;
  /** Whether user is on mobile Safari */
  isMobile: boolean;
}

/**
 * Options for useMobileSafariWallet hook
 */
export interface MobileSafariWalletOptions {
  /** Whether to automatically retry failed connections (default: true) */
  autoRetry?: boolean;
  /** Delay in ms before retrying connection (default: 2000) */
  retryDelay?: number;
  /** Callback when connection fails after retry */
  onConnectionFailed?: () => void;
}
