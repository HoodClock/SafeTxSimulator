"use client";

export default function WalletConnect({ connectWallet }) {
  return (
    <button
      onClick={connectWallet}
      className="bg-yellow-200 text-black px-6 py-2 rounded hover:bg-yellow-500"
    >
      Connect Wallet
    </button>
  );
}
