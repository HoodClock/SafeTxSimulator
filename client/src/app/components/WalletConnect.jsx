// app/components/WalletConnect.jsx
"use client";
import { useState } from "react";
import { useWallet } from "../hooks/userWallet";
import { toast } from "react-toastify";
import { GiWallet } from "react-icons/gi"; 
import { MdDelete } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";

export default function WalletConnect() {
  const { walletConnected, walletAddress, connectWallet, disconnect } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      await connectWallet();
    } catch (error) {
      toast.error(`Connection failed: ${error.message}`, {
        autoClose: 5000,
        position: "top-right",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (walletConnected) {
        await disconnect();
        toast.info("Account is Disconnected", { autoClose: 1000 });
      }
    } catch (error) {
      toast.error(`Connection failed: ${error.message}`, {
        autoClose: 5000,
        position: "top-right",
      });
    }
  };

  return (
    <div className="flex space-x-2 gap-3">
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className={`relative px-6 py-2 rounded-lg bg-gradient-to-r from-[#00FFC6] to-[#00AAFF] text-black font-semibold shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center ${isConnecting ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isConnecting ? (
          "Connecting..."
        ) : walletConnected && walletAddress ? (
          <>
            <GiWallet className="mr-2 text-lg" />
            {`${walletAddress.slice(0, 9)}...`}
          </>
        ) : (
          <GiWallet className="text-lg" />
        )}
      </button>
      {walletConnected && (
        <button
          onClick={handleDelete}
          className="relative px-6 py-2 rounded-lg bg-gradient-to-r from-[#FF9800] to-[#D32F2F] text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center"
        >
          <MdDelete className="text-lg" />
        </button>
      )}
    </div>
  );
}