# Mobile Wallet Connection Fix

Fixes for mobile Safari wallet connections that actually work.

## The Problem

If you've built a Web3 app, you know mobile Safari is a nightmare. User clicks "Connect Wallet", MetaMask opens, they approve, come back to your app and... nothing. Connection just hangs.

I spent way too long fighting this on a production app. This repo has the fixes that actually worked.

## What's Here

- `useMobileSafariWallet.ts` - Hook that handles the Safari visibility issue
- Works with Wagmi v2
- Tested on real users (60%+ mobile traffic)

## Usage

```tsx
import { useMobileSafariWallet } from './useMobileSafariWallet';

function WalletButton() {
  const { address, isConnected, connect, disconnect } = useMobileSafariWallet();
  
  if (isConnected) {
    return <button onClick={disconnect}>{address}</button>;
  }
  
  return <button onClick={connect}>Connect</button>;
}
```

## How It Works

Safari suspends your page when the user switches to MetaMask. The Visibility API detects when they come back and gives the connection time to complete.

That's it. No magic.

## Requirements

- React 18+
- Wagmi v2
- Viem

## Notes

- Tested on production app with 65+ transactions
- Works with MetaMask, Trust Wallet, WalletConnect
- Still requires page reload sometimes on Safari (that's just Safari being Safari)

## TODO

- [ ] Add TypeScript types
- [ ] Test on Android
- [ ] Maybe add examples

## License

MIT - do whatever you want with it
