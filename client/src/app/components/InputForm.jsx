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
  const {simulationData, setSimulationData} = useSimulate();


  const inputFormSubmission = async ()=> {

    if (!isConnected) {
      await handleConnect();
    }

    const formData = {
      recipient : recipient,
      amount : amount,
      userWalletAddress : address
    }

    try {
      const response = await axios.post("/api/simulate/", formData);
  
      setSimulationData(response.data);
    } catch (error) {
      console.error("Error:", error.response?.data?.error || "Unknown error");
      toast.error(error.response?.data?.error || "Something went wrong");
    }
  }

  return (
    <>
       <div className="p-6 w-full max-w-lg bg-[#121212]/90 backdrop-blur-md rounded-xl shadow-xl border border-[#2A2A2A]">
        <h2 className="text-2xl font-bold text-[#00FFAA] tracking-wide mb-4 border-b border-[#2A2A2A] pb-2">
          Transaction Credentials
        </h2>

        <div className="relative w-full mb-4">
          <FaUser className="absolute left-3 top-3 text-[#00FFC6] text-lg" />
          <input
            type="text"
            placeholder="Recipient Address"
            name="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full p-3 pl-10 rounded-lg bg-[#1A1A1A] text-white border border-[#3A3A3A] focus:outline-none focus:ring-2 focus:ring-[#00FFC6] transition-shadow"
          />
        </div>

        <div className="relative w-full mb-4">
          <FaEthereum className="absolute left-3 top-3 text-[#FF9800] text-lg" />
          <input
            type="number"
            placeholder="Amount (ETH)"
            name="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 pl-10 rounded-lg bg-[#1A1A1A] text-white border border-[#3A3A3A] focus:outline-none focus:ring-2 focus:ring-[#FF9800] transition-shadow"
          />
        </div>

        <button
          onClick={inputFormSubmission}
          className="w-full p-3 rounded-lg bg-[#00FFAA] text-[#121212] font-semibold flex items-center justify-center gap-2 shadow-md hover:bg-[#00FFC6] transition-all hover:scale-105"
        >
          <FaCheck className="text-[#121212]" /> Simulate Transaction
        </button>
      </div>
      <div>
        <TxSimulationResult simulationData={simulationData} />
      </div>
    </>
  );
}
