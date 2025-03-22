// app/hooks/useWallet.js
'use client';
import { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import { useAccount, useConnect, useDisconnect} from 'wagmi';
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
          if (!walletProvider){
            if (/Android|iPhone/i.test(navigator.userAgent)) {
              toast.info("Please use a wallet app like MetaMask or select WalletConnect.");
              return;
            }
            throw new Error("No wallet provider available");
          } 

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

      // Try the injected connector (MetaMask) first
      if (window.ethereum) {
        await connect({ connector: connectors[0] }); // connectors[0] is injected (MetaMask)
      } else {
        // If no injected provider, fall back to WalletConnect
        if (/Android|iPhone/i.test(navigator.userAgent)) {
          toast.info("Select WalletConnect or open this site in your wallet app.");
          await connect({ connector: connectors[1] });
        } else {
          toast.info("No MetaMask detected. Using WalletConnect...");
        }
       } // web3_model open 
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