"use client";
import { toast } from "react-toastify";
import { useState, useEffect } from "react"; // Add useEffect
import { GiWallet } from "react-icons/gi";
import { MdDelete } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";
import { useWalletConnect } from "../hooks/useWalletConnect";

export default function WalletConnect() {
  const { address, isConnected, isConnecting, handleConnect, handleDisconnect } = useWalletConnect();
  const [isMounted, setIsMounted] = useState(false); // Track if component has mounted

  // Set isMounted to true after the component mounts on the client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleWalletConnect = async () => {
    try {
      await handleConnect();
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

  // Render a placeholder on the server (before mounting)
  if (!isMounted) {
    return (
      <div className="flex space-x-2 gap-3">
        <button
          disabled
          className="relative px-6 py-2 rounded-lg bg-gradient-to-r from-[#00FFC6] to-[#00AAFF] text-[#121212] font-semibold shadow-md opacity-50 cursor-not-allowed flex items-center justify-center"
        >
          <GiWallet className="mr-2 text-lg" />
          Connect Wallet
        </button>
      </div>
    );
  }

  // Render the full component on the client (after mounting)
  return (
    <div className="flex space-x-2 gap-3">
      <button
        onClick={handleWalletConnect}
        disabled={isConnecting}
        className={`relative px-6 py-2 rounded-lg bg-gradient-to-r from-[#00FFC6] to-[#00AAFF] text-[#121212] font-semibold shadow-md transition-all duration-300 hover:shadow-[0_0_15px_#00FFC6] flex items-center justify-center ${
          isConnecting ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isConnecting ? (
          "Connecting..."
        ) : isConnected && address ? (
          <>
            <GiWallet className="mr-2 text-lg" />
            {`${address.slice(0, 6)}...${address.slice(-4)}`}
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
          onClick={handleWalletDisconnect} // Fixed to use the correct handler
          className="relative px-4 py-2 rounded-lg bg-[#2A2A2A] text-white font-semibold shadow-lg transition-all duration-300 hover:bg-[#FF5252] flex items-center justify-center"
        >
          <MdDelete className="text-lg" />
        </button>
      )}
    </div>
  );
}