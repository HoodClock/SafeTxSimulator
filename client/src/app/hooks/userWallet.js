// A custom hook for userWallet globaly accessability

import { useState, useEffect } from "react";
import connectWallet from "../utils/blockchain";
import {ethers} from "ethers"
import { createAppKit } from "@reown/appkit";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { mainnet } from "@reown/appkit/networks";
import dotenv from 'dotenv';

dotenv.config();

// for the appkit (wallet Connection from reown)
// const projectId = process.env.REOWN_PROJECT_ID;
const projectId = "f70ffe18a7d76affdfc37d8cbaffed9d"
const _vercelDepployedLink = process.env.VERCEL_DEPLYED_LINK;
const appKit = createAppKit({
  projectId,
  networks: [mainnet],
  metadata: {
    name: "safeTxSim",
    description: "Simulate Ethereum transactions",
    url: _vercelDepployedLink,
  },
  adapters: [new EthersAdapter()],
});

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

   // Connect wallet with AppKit
  const connect = async () => {
    try {
      await appKit.open(); // Opens AppKit wallet selection modal
      const walletProvider = appKit.getEthersProvider();
      if (!walletProvider) throw new Error("No wallet selected");

      const provider = new ethers.BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setWalletAddress(address);
      setWalletConnected(true);
    } catch (error) {
      console.error("Wallet connection failed:", error);
      setWalletConnected(false);
      setWalletAddress(null);
    }
  };

  return { walletConnected, walletAddress, connect };

}