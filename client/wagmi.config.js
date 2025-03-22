// client/wagmi.config.js
import { createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { walletConnect, injected } from "wagmi/connectors";
import { configDotenv } from "dotenv";

configDotenv();

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
const providerUrl = process.env.ETH_MAINNET_ALCHEMY_URL_API_KEY;

console.log("Project Id", projectId);

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    injected({ target: "metaMask" }), // MetaMask
    walletConnect({ projectId }), // WalletConnect
  ],
  transports: {
    [mainnet.id]: http(providerUrl),
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