import { FaUser, FaWallet, FaGasPump, FaCheckCircle, FaNetworkWired } from "react-icons/fa";
import { MdAttachMoney, MdOutlinePriceChange } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

export default function TxSimulationResult({ simulationData }) { 
  if (!simulationData) {
    return ""
  }

  const icons = {
    receiverAddress: <FaUser className="text-[#00FFC6] text-lg" />,
    userAddress: <FaUser className="text-[#00FFC6] text-lg" />,
    amount: <MdAttachMoney className="text-[#FF9800] text-lg" />,
    gasCostEth: <FaGasPump className="text-[#FFEB3B] text-lg" />,
    gasCostUsd: <MdOutlinePriceChange className="text-[#FFEB3B] text-lg" />,
    balanceBefore: <FaWallet className="text-[#4CAF50] text-lg" />,
    balanceAfter: <FaWallet className="text-[#4CAF50] text-lg" />,
    isValidReciever: <IoMdCheckmarkCircleOutline className="text-[#2196F3] text-lg" />,
    transactionStatus: <FaCheckCircle className="text-[#8BC34A] text-lg" />,
    ethPriceInUsd: <MdOutlinePriceChange className="text-[#FF5722] text-lg" />,
    network: <FaNetworkWired className="text-[#673AB7] text-lg" />,
  };
  

  return (
    <div className="p-6 w-full max-w-4xl mt-6 flex flex-wrap gap-4 bg-[#121212] backdrop-blur-md rounded-xl shadow-xl border border-[#2A2A2A]">
    <h2 className="w-full text-2xl font-bold text-[#00FFAA] tracking-wide mb-4 border-b border-[#2A2A2A] pb-2">
      Simulation Result
    </h2>
    {Object.entries(simulationData).map(([key, value]) => (
      <div
        key={key}
        className="flex-1 min-w-[250px] max-w-[320px] border border-[#3A3A3A] rounded-lg p-4 bg-[#1A1A1A] shadow-md transition-transform hover:scale-105 flex items-center gap-3"
      >
        {icons[key] || <FaUser className="text-[#888] text-lg" />}
        <div className="w-full">
          <p className="text-[#00FFAA] uppercase font-medium text-sm truncate">
            {key.replace(/([A-Z])/g, " $1").trim()}:
          </p>
          <span className="text-[#EAEAEA] font-light block text-sm break-words">
            {value.toString()}
          </span>
        </div>
      </div>
    ))}
  </div>
  );
}