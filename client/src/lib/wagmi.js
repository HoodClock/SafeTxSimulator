import { createConfig, http } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

const projectId =  '2d34df257efc7f32e775b6f41c113656'

export const config = createConfig({
  chains: [mainnet],
  connectors: [
    injected(),
    walletConnect({projectId})
  ],
  transports: {
    [mainnet.id]: http(
      `https://eth-mainnet.g.alchemy.com/v2/OGV_n2eZLWhUudF4l0BaNCt94X7FIJKX`
    )
  }
})

export {projectId}