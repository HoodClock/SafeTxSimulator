import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount, useDisconnect } from 'wagmi'

export function useWalletConnect() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const {discount} = useDisconnect();

  const handleConnect = () => {
    open();
  }

  const handleDisconnect = () => {
    discount();
  }

  return {
    address,
    isConnected,
    handleConnect,
    handleDisconnect
  }
}