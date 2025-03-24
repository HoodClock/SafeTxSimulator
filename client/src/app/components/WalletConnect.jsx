"use client";
import { toast } from "react-toastify";
import { useState } from "react";
import { GiWallet } from "react-icons/gi";
import { MdDelete } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";
import { useWalletConnect } from "../hooks/useWalletConnect";


export default function WalletConnect() {
  const { address, isConnected, isConnecting, handleConnect, handleDisconnect } = useWalletConnect();

  const handleWalletConnect = async () => {
    try {
      await handleConnect(); // Hook manages retries and state
      toast.success("Wallet connected successfully!", {
        autoClose: 3000,
        position: "top-right",
      });
    } catch (error) {
      toast.error(`Connection failed: ${error.message}`, {
        autoClose: 5000,
        position: "top-right",
      });
    }
  };

  const handleWalletDisconnect = async () => {
    try {
      if (isConnected) {
        await handleDisconnect();
        toast.info("Wallet Disconnected", { autoClose: 1000 });
      }
    } catch (error) {
      toast.error("Disconnection failed", { autoClose: 3000 });
    }
  };

  return (
    <div className="flex space-x-2 gap-3">
      <button
        onClick={handleWalletConnect}
        disabled={isConnecting}
        className={`relative px-6 py-2 rounded-lg bg-gradient-to-r from-[#00FFC6] to-[#00AAFF] text-black font-semibold shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center ${
          isConnecting ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isConnecting ? (
          "Connecting..."
        ) : isConnected && address ? (
          <>
            <GiWallet className="mr-2 text-lg" />
            {`${address.slice(0, 9)}...`}
          </>
        ) : (
          <>
            <GiWallet className="mr-2 text-lg" />
            Connect Wallet
          </>
        )}
      </button>
      {isConnected && (
        <button
          onClick={handleDisconnect}
          className="relative px-6 py-2 rounded-lg bg-gradient-to-r from-[#FF9800] to-[#D32F2F] text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center"
        >
          <MdDelete className="text-lg" />
        </button>
      )}
    </div>
  );
}