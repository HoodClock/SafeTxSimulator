"use client";
import { useState } from "react";

export default function TxInputForm({ simulateTx }) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <div className="bg-gray-800 p-6 rounded shadow-md w-full max-w-md">
      <h2 className="text-white text-lg mb-4">Transaction Details</h2>
      <input
        type="text"
        placeholder="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
      />
      <input
        type="number"
        placeholder="Amount (ETH)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
      />
      <button
        onClick={() => simulateTx(recipient, amount)}
        className="bg-green-600 w-full p-2 rounded text-white hover:bg-green-700"
      >
        Simulate Transaction
      </button>
    </div>
  );
}
