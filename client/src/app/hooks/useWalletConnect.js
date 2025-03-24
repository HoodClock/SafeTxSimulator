import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount, useDisconnect } from 'wagmi'

export function useWalletConnect() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const {disconnect} = useDisconnect();

  const handleConnect = () => {
    open();
  }

  const handleDisconnect = () => {
    disconnect();
  }

  return {
    address,
    isConnected,
    handleConnect,
    handleDisconnect
  }
}