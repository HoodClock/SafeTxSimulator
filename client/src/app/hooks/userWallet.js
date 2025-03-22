"use client";
import { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useWeb3Modal } from '@web3modal/wagmi/react';

export const useWallet = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const hasShownToast = useRef(false);

  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();

  useEffect(() => {
    const initializeProvider = async () => {
      if (isConnected && address) {
        try {
          const walletProvider = window.ethereum || (await connectors[0].getProvider?.());
          if (!walletProvider) {
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

          if (!hasShownToast.current) {
            toast.success("Wallet connected!", { autoClose: 1000 });
            hasShownToast.current = true;
          }
        } catch (error) {
          console.error("Initial wallet setup failed:", error);
          setWalletConnected(false);
          setWalletAddress(null);
          setProvider(null);
          toast.error("Failed to connect wallet. Please try again or use WalletConnect.");
        }
      } else {
        setWalletConnected(false);
        setWalletAddress(null);
        setProvider(null);
      }
    };

    initializeProvider();
  }, [isConnected, address, connectors]);

  const connectWallet = async () => {
    try {
      if (walletConnected) return;

      // Log the available connectors for debugging
      console.log("Available connectors:", connectors);

      // Find the injected (MetaMask) and WalletConnect connectors
      const injectedConnector = connectors.find(
        (connector) => connector.type === "injected" && connector.id === "io.metamask"
      );
      const walletConnectConnector = connectors.find(
        (connector) => connector.type === "walletConnect"
      );

      if (!walletConnectConnector) {
        console.error("WalletConnect connector not found:", { walletConnectConnector });
        throw new Error("WalletConnect connector not found.");
      }

      // Try the injected connector (MetaMask) first
      if (window.ethereum && window.ethereum.isMetaMask) {
        console.log("window.ethereum exists:", !!window.ethereum);
console.log("window.ethereum.isMetaMask:", window.ethereum?.isMetaMask);
        console.log("Using injected connector (MetaMask)");
        connect({ connector: injectedConnector });
      } else {
        // If no injected provider, fall back to WalletConnect
        if (/Android|iPhone/i.test(navigator.userAgent)) {
          toast.info("Select WalletConnect or open this site in your wallet app.");
        } else {
          toast.info("No MetaMask detected. Using WalletConnect...");
        }
        console.log("Using WalletConnect connector");
        await open();
        connect({ connector: walletConnectConnector });
      }
    } catch (error) {
      console.error("Wallet connection failed:", error);
      setWalletConnected(false);
      setWalletAddress(null);
      setProvider(null);
      toast.error("Wallet connection failed. Please try again or check your wallet.");
      throw error;
    }
  };

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