"use client";
import { useWallet } from "../hooks/userWallet";

export default function WalletConnect() {

  const {walletConnected, walletAddress, connect} = useWallet();

  const handleConnect = async ()=> {
    try {

      await connect();

    } catch (error) {
      console.log("Something wrong while connecting wallet", error)
    }
  }

  return (
    <button
      onClick={handleConnect}
      className="bg-yellow-200 text-black px-6 py-2 rounded hover:bg-yellow-500"
    >
      {walletConnected && walletAddress
        ? `Connected: ${walletAddress.slice(0,9)}...`
        : "Connect Wallet"}
    </button>
  );
}
