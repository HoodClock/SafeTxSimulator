// client/wagmi.config.js
import { createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { walletConnect, injected } from "wagmi/connectors";
import { configDotenv } from "dotenv";

configDotenv();

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "f70ffe18a7d76affdfc37d8cbaffed9d";

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    injected({ target: "metaMask" }), // MetaMask
    walletConnect({ projectId }), // WalletConnect
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

export const web3ModalConfig = {
  projectId,
  metadata: {
    name: "Safe Transaction Simulator",
    description: "Try to simulate the transaction without even spending any penny.",
    url: process.env.VERCEL_DEPLYED_LINK || "http://localhost:3000",
  },
};