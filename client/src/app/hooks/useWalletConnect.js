import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount, useDisconnect } from 'wagmi'
import { useCallback, useRef } from 'react';

export function useWalletConnect() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const {disconnect} = useDisconnect();
  const isConnectingRef = useRef(false);

  // Connection with retry logic
  const handleConnect = useCallback(async () => {
    if (isConnectingRef.current) return;

    isConnectingRef.current = true;
    const maxAttempts = 3;
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        await open();
        console.log('Wallet connected successfully');
        break; // Exit on success
      } catch (error) {
        attempts++;
        console.error(`Connection attempt ${attempts} failed:`, error);
        if (attempts === maxAttempts) {
          throw new Error('Failed to connect after retries');
        }
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2sec delay
      }
    }

    isConnectingRef.current = false;
  }, [open]);

  // Disconnect handler
  const handleDisconnect = useCallback(() => {
    disconnect();
    console.log('Wallet disconnected');
  }, [disconnect]);

  return {
    address,
    isConnected,
    isConnecting: isConnectingRef.current,
    handleConnect,
    handleDisconnect,
  };
}