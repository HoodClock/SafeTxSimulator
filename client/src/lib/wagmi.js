import { createConfig, http } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'
import dotenv from 'dotenv'

dotenv.config();

const projectId =  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

export const config = createConfig({
  chains: [mainnet],
  connectors: [
    injected(),
    walletConnect({projectId})
  ],
  transports: {
    [mainnet.id]: http(
      process.env.ETH_MAINNET_ALCHEMY_URL_API_KEY
    )
  }
})

export {projectId}