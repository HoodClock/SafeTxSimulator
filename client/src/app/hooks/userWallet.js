// A custom hook for userWallet globaly accessability

import { useState, useEffect } from "react";
import connectWallet from "../utils/blockchain";

export const useWallet = ()=> {

    const [walletConnected, setWalletConnected] = useState(false)
    const [walletAddress, setWalletAddress] = useState(null)

    // if wallet is already connected
    useEffect(() => {
        const checkInitialConnection = async () => {
          if (typeof window !== "undefined" && window.ethereum && window.ethereum.selectedAddress) {
            try {
              const { signer } = await connectWallet();
              const address = await signer.getAddress();
              setWalletAddress(address);
              setWalletConnected(true);
            } catch (error) {
              console.error("Initial wallet check failed:", error);
            }
          }
        };
        checkInitialConnection();
      }, []);

    //   for connecting wallet (manual connecting the wallet)
    const connect = async () => {
        try {
          const { signer } = await connectWallet();
          const address = await signer.getAddress(); 
          setWalletAddress(address);
          setWalletConnected(true);
        } catch (error) {
          console.error("Wallet connection failed:", error);
          setWalletConnected(false);
          setWalletAddress(null);
        }
      };

    return {walletConnected, walletAddress, connect}

}