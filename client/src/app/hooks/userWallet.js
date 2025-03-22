// app/hooks/useWallet.js
'use client';
import { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";




export const useWallet = () => {
  // saving up some states
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const hasShownToast = useRef(false);

  // Using Wagmi hooks
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();


  useEffect(() => {
    
    const initializeProvider = async () => {
      if (isConnected && address) {
        try {
          const walletProvider = window.ethereum || (await connectors[0].getProvider?.());
          if (!walletProvider) throw new Error("No wallet provider available");

          const ethersProvider = new ethers.BrowserProvider(walletProvider);
          setProvider(ethersProvider);
          setWalletAddress(address);
          setWalletConnected(true);
          
          // to check for toast using useRef
          if(!hasShownToast.current){
            toast.success("Wallet connected!", { autoClose: 1000 });
            hasShownToast.current = true // now it will not shown again
          }

        } catch (error) {
          console.error("Initial wallet setup failed:", error);
          setWalletConnected(false);
          setWalletAddress(null);
          setProvider(null);
        }
      } else {
        setWalletConnected(false);
        setWalletAddress(null);
        setProvider(null);
      }
    };

    initializeProvider();
  }, [isConnected, address, connectors]);

  // connting logic
  const connectWallet = async () => {
    try {
      if (walletConnected) return;
      connect({ connector: connectors[0] }); // Triggers Web3Modal
    } catch (error) {
      console.error("Wallet connection failed:", error);
      setWalletConnected(false);
      setWalletAddress(null);
      setProvider(null);
      throw error;
    }
  };

  // Disconnecting logic
  const disconnectWallet = () => {
    disconnect();
    setWalletConnected(false);
    setWalletAddress(null);
    setProvider(null);
  };

  return {
    walletConnected,
    walletAddress,
    connectWallet,
    provider,
    disconnect: disconnectWallet,
  };
};