import { FaUser, FaWallet, FaGasPump, FaCheckCircle, FaTimesCircle, FaNetworkWired } from "react-icons/fa";
import { MdAttachMoney, MdOutlinePriceChange } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

export default function TxSimulationResult({ simulationData }) { 
  
  console.log("Rendering with data:", simulationData);

  if (!simulationData) {
    return (
      ""
    );
  }

  const icons = {
    receiverAddress: <FaUser className="text-[#00FFC6] text-lg" />,
    userAddress: <FaUser className="text-[#00FFC6] text-lg" />,
    amount: <MdAttachMoney className="text-[#FF9800] text-lg" />,
    gasCostEth: <FaGasPump className="text-[#FFEB3B] text-lg" />,
    gasCostUsd: <MdOutlinePriceChange className="text-[#FFEB3B] text-lg" />,
    balanceBefore: <FaWallet className="text-[#4CAF50] text-lg" />,
    balanceAfter: <FaWallet className="text-[#4CAF50] text-lg" />,
    isValidReciever: simulationData.isValidReciever !== false
      ? <IoMdCheckmarkCircleOutline className="text-[#2196F3] text-lg" /> 
      : <FaTimesCircle className="text-red-500 text-lg" />,
    transactionStatus: simulationData.transactionStatus === "Likely to succeed"
      ? <FaCheckCircle className="text-[#8BC34A] text-lg" /> 
      : <FaTimesCircle className="text-red-500 text-lg" />,
    ethPriceInUsd: <MdOutlinePriceChange className="text-[#FF5722] text-lg" />,
    networkDetails: <FaNetworkWired className="text-[#673AB7] text-lg" />,
    // add a fallback
    network: <FaNetworkWired className="text-[#673AB7] text-lg" />,

  };

  const formatValue = (value) => {
    if (Array.isArray(value)) {
      return value.join(", "); // Removes brackets & quotes from arrays
    } 
    if (typeof value === "object" && value !== null) {
      return Object.entries(value)
        .map(([k, v]) => `${k}: ${v}`)
        .join(" | "); // Formats objects as "key: value" pairs
    }
    return value.toString();
  };

  return (
    <div className="p-6 w-full max-w-4xl mt-6 flex flex-wrap gap-4 bg-[#121212] backdrop-blur-md rounded-xl shadow-xl border border-[#2A2A2A]">
  <h2 className="w-full text-2xl font-bold text-[#00FFAA] tracking-wide mb-4 border-b border-[#2A2A2A] pb-2">
    Simulation Result
  </h2>

  {/* Main Error Display */}
  {simulationData.ErrorReason && (
    <div className="w-full p-4 bg-red-900/80 text-white rounded-lg flex items-center gap-3">
      <FaTimesCircle className="text-2xl" />
      <div>
        <h3 className="font-bold">Transaction Will Fail</h3>
        <p>{simulationData.ErrorReason}</p>
        {simulationData.isRecieverContract && (
          <p className="mt-2 text-yellow-300 flex items-center gap-2">
            <FaNetworkWired /> Recipient is a smart contract
          </p>
        )}
      </div>
    </div>
  )}

  {/* Additional Errors List */}
  {simulationData.errors?.length > 0 && (
    <div className="w-full p-4 bg-[#FF5722]/80 text-white rounded-lg">
      <h3 className="font-semibold flex items-center gap-2">
        <FaTimesCircle /> Validation Errors:
      </h3>
      <ul className="mt-2 space-y-1">
        {simulationData.errors.map((err, i) => (
          <li key={i}>• {err}</li>
        ))}
      </ul>
    </div>
  )}

  {/* Data Cards */}
  {Object.entries(simulationData).map(([key, value]) => (
    !['errors', 'ErrorReason'].includes(key) && (
      <div
        key={key}
        className={`flex-1 min-w-[250px] max-w-[320px] border rounded-lg p-4 bg-[#1A1A1A] shadow-md transition-all hover:scale-[1.02] flex items-center gap-3 ${
          value === null ? 'border-red-500/50' : 'border-[#3A3A3A]'
        }`}
      >
        {icons[key] || <FaUser className="text-[#888] text-lg" />}
        <div className="w-full">
          <p className="text-[#00FFAA] uppercase font-medium text-sm truncate">
            {key.replace(/([A-Z])/g, " $1").trim()}:
          </p>
          <span className={`block text-sm break-words ${
            value === null ? 'text-red-400 italic' : 'text-[#EAEAEA] font-light'
          }`}>
            {value === null ? 'Estimation failed' : formatValue(value)}
          </span>
        </div>
      </div>
    )
  ))}
</div>
  );
}
