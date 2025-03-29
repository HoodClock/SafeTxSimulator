 "use client";

export default function Navbar() {
  return (
    <nav className="w-full px-6 py-4 flex justify-between items-center backdrop-blur-md">
      <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00FFC6] to-[#00AAFF]">
        SafeTxSim
      </h1>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-[#888]">Mainnet</span>
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
      </div>
    </nav>
  );
}