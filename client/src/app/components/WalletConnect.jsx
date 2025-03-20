"use client";
import { useWallet } from "../hooks/userWallet";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function WalletConnect() {

  const {walletConnected, walletAddress, connect} = useWallet();

  const handleConnect = async ()=> {
    try {

      await connect();
      if (walletConnected) {
        toast.success("Wallet connected!", { autoClose: 3000 });
      }

    } catch (error) {
      toast.error(`Connection failed: ${error.message}`, {
        autoClose: 5000,
        position: "top-right",
      });
    }
  }

  return (
    <button
  onClick={handleConnect}
  className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#00FFC6] to-[#00AAFF] text-black font-semibold shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
>
  {walletConnected && walletAddress
    ? `Connected: ${walletAddress.slice(0, 9)}...`
    : "Connect Wallet"}
</button>
  );
}
