import { createConfig, http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'
import dotenv from 'dotenv'

dotenv.config();

const projectId =  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    injected(),
    walletConnect({
      projectId,
      relayUrl: 'wss://relay.walletconnect.com',
      metadata: {
        name: "Safe Transaction Simulator",
        description: "Try to simulate the transaction without even spending any penny.",
        url: "https://safe-tx-simulator.vercel.app/",
        icons: ["/favicon.ico"]
      }
    })
  ],
  transports: {
    [mainnet.id]: http(
      process.env.ETH_MAINNET_ALCHEMY_URL_API_KEY
    ), 
    [sepolia.id] : http(
      process.env.ETH_SEPOLIA_ALCHEMY_URL_API_KEY
    )
  }
})

export {projectId}