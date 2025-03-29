"use client";
import { useState } from "react";
import axios from "axios";
import { FaEthereum, FaUser, FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import { useWalletConnect } from "../hooks/useWalletConnect";
import { useSimulate } from "../hooks/useSimulate";
import TxSimulationResult from "./TxSimResult";

export default function TxInputForm() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const { address, isConnected, handleConnect } = useWalletConnect();
  const { simulationData, updateSimulation, setIsLoading } = useSimulate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      await handleConnect();
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post("/api/simulate/", {
        recipient,
        amount,
        userWalletAddress: address
      });
      
      updateSimulation(response.data);
    } catch (error) {
      console.error("Error:", error.response?.data?.error || "Unknown error");
      toast.error(error.response?.data?.error || "Something went wrong");
      updateSimulation({
        ErrorReason: error.response?.data?.error || "Simulation failed",
        transactionStatus: "Will Fail"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
       <div className="p-6 w-full max-w-md bg-[#121212]/90 backdrop-blur-md rounded-xl shadow-xl border border-[#2A2A2A]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">
          Transaction Simulation
        </h2>
        <div className="text-xs px-2 py-1 rounded-full bg-[#2A2A2A] text-[#00FFAA]">
          LIVE
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#888] mb-1">Recipient Address</label>
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-[#00FFC6]" />
            <input
              type="text"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full p-3 pl-10 rounded-lg bg-[#1A1A1A] text-white border border-[#3A3A3A] focus:outline-none focus:ring-1 focus:ring-[#00FFC6] transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#888] mb-1">Amount</label>
          <div className="relative">
            <FaEthereum className="absolute left-3 top-3 text-[#FF9800]" />
            <input
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 pl-10 rounded-lg bg-[#1A1A1A] text-white border border-[#3A3A3A] focus:outline-none focus:ring-1 focus:ring-[#FF9800] transition-all"
              min="0"
              step="any"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full p-3 rounded-lg bg-gradient-to-r from-[#00FFC6] to-[#00AAFF] text-[#121212] font-semibold flex items-center justify-center gap-2 hover:shadow-[0_0_15px_#00FFC6] transition-all"
        >
          <FaCheck /> Simulate Transaction
        </button>
      </form>

    </div>
      <TxSimulationResult simulationData={simulationData}/>
</>
);
}