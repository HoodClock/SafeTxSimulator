"use client";
import { useState } from "react";
import axios from "axios";
import { useWallet } from "../hooks/userWallet";
import { useSimulate } from "../hooks/useSimulate";
import TxSimulationResult from "./TxSimResult";

export default function TxInputForm() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const {walletConnected, walletAddress, connect} = useWallet();
  const {simulationData, setSimulationData} = useSimulate();


  const inputFormSubmission = async ()=> {

    if (!walletConnected){
      await connect();
    }


    const formData = {
      recipient : recipient,
      amount : amount,
      userWalletAddress : walletAddress
    }

    const response = await axios.post("/api/simulate/", formData);

    setSimulationData(response.data);

  }

  return (
    <div className="bg-gray-800 p-6 rounded shadow-md w-full max-w-md">
      <h2 className="text-white text-lg mb-4">Transaction Details</h2>
      <input
        type="text"
        placeholder="Recipient Address"
        name="recipient"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
      />
      <input
        type="number"
        placeholder="Amount (ETH)"
        name="amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
      />
      <button
        onClick={inputFormSubmission}
        className="bg-green-600 w-full p-2 rounded text-white hover:bg-green-700"
      >
        Simulate Transaction
      </button>

      <div><TxSimulationResult simulationData={simulationData}/></div>
    </div>
  );
}
