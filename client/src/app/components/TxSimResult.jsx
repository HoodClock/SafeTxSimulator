import { memo } from "react";
import {
  FaUser,
  FaWallet,
  FaGasPump,
  FaCheckCircle,
  FaTimesCircle,
  FaNetworkWired,
  FaEthereum,
} from "react-icons/fa";
import {
  MdAttachMoney,
  MdOutlinePriceChange,
  MdSecurity,
} from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

// Status config (unchanged)
const statusConfig = {
  fail: {
    icon: <FaTimesCircle className="text-[#FF4D4D] text-2xl" />,
    bg: "bg-[#2A0A0A]",
    border: "border-[#FF4D4D]/30",
    text: "text-[#FF4D4D]",
  },
  warning: {
    icon: <MdSecurity className="text-[#FFAA33] text-2xl" />,
    bg: "bg-[#2A200A]",
    border: "border-[#FFAA33]/30",
    text: "text-[#FFAA33]",
  },
  success: {
    icon: <FaCheckCircle className="text-[#33FFAA] text-2xl" />,
    bg: "bg-[#0A2A1A]",
    border: "border-[#33FFAA]/30",
    text: "text-[#33FFAA]",
  },
};

// Header Component
const TxHeader = memo(({ simulationData }) => {
  const getStatus = () => {
    if (simulationData.ErrorReason) return statusConfig.fail;
    if (simulationData.honeyPotWarning?.warning) return statusConfig.warning;
    return statusConfig.success;
  };
  const status = getStatus();

  return (
    <div
      className={`p-5 ${status.bg} ${status.border} border-b flex items-center justify-between`}
    >
      <div className="flex items-center gap-3">
        {status.icon}
        <h2 className="text-xl font-bold text-white">
          Transaction Simulation Result
        </h2>
      </div>
      <div className="flex items-center gap-2">
        <div
          className={`px-3 py-1 rounded-full text-xs font-bold ${status.text} bg-black/20`}
        >
          {simulationData.transactionStatus || "Simulated"}
        </div>
        {simulationData.transactionType !== undefined && (
          <div className="px-2 py-1 rounded-full text-xs font-medium bg-[#33335A] text-[#A0A0FF]">
            {simulationData.transactionType === 0
              ? "Legacy"
              : simulationData.transactionType === 1
              ? "EIP-2930"
              : "EIP-1559"}
          </div>
        )}
      </div>
    </div>
  );
});

// Financial Summary Component
const FinancialSummary = memo(({ simulationData }) => (
  <div className="bg-[#12121A] rounded-xl p-5 border border-[#2A2A3A]">
    <h3 className="text-lg font-semibold text-[#A0A0FF] mb-4 flex items-center gap-2">
      <FaEthereum /> Financial Summary
    </h3>
    <div className="space-y-4">
      <div className="flex justify-between items-center pb-4 border-b border-[#2A2A3A]">
        <div className="text-[#A0A0FF]">ETH Price</div>
        <div className="font-mono text-[#33FFAA]">
          ${simulationData.ethPriceInUsd?.toLocaleString() || "0.00"}
        </div>
      </div>
      <div className="flex justify-between items-center pt-2">
        <div className="text-[#A0A0FF]">Balance</div>
        <div className="flex items-center gap-8">
          <div className="text-right">
            <div className="text-xs text-[#888]">Before</div>
            <div className="font-mono">
              {simulationData.balanceBefore || "0.0"} ETH
            </div>
          </div>
          <div className="text-2xl text-[#888]">→</div>
          <div className="text-right">
            <div className="text-xs text-[#888]">After</div>
            <div
              className={`font-mono ${
                simulationData.balanceAfter?.startsWith("-")
                  ? "text-[#FF4D4D]"
                  : "text-[#33FFAA]"
              }`}
            >
              {simulationData.balanceAfter || "0.0"} ETH
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-[#2A2A3A]">
        <div className="text-[#A0A0FF]">Transfer Amount</div>
        <div className="font-mono text-[#FFAA33]">
          {simulationData.amount || "0.0"} ETH
        </div>
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-[#2A2A3A]">
        <div className="text-[#A0A0FF]">Gas Fees</div>
        <div className="text-right">
          <div className="font-mono">
            {simulationData.gasCostEth || "0.0"} ETH
          </div>
          <div className="text-xs text-[#888]">
            ≈ ${simulationData.gasCostUsd || "0.00"}
          </div>
        </div>
      </div>
    </div>
  </div>
));

// Transaction Details Component
const TransactionDetails = memo(({ simulationData }) => (
  <div className="bg-[#12121A] rounded-xl p-5 border border-[#2A2A3A]">
    <h3 className="text-lg font-semibold text-[#A0A0FF] mb-4 flex items-center gap-2">
      <FaNetworkWired /> Transaction Details
    </h3>
    <div className="space-y-4">
      <div>
        <div className="text-[#A0A0FF] mb-2">Addresses</div>
        <div className="space-y-3">
          <div>
            <div className="text-xs text-[#888]">From</div>
            <div className="font-mono text-sm text-white break-all">
              {simulationData.userAddress || "Not available"}
            </div>
          </div>
          <div>
            <div className="text-xs text-[#888]">To</div>
            <div className="font-mono text-sm text-white break-all">
              {simulationData.receiverAddress || "Not available"}
            </div>
            {simulationData.isContract && (
              <div className="mt-1 text-xs text-[#FFAA33] flex items-center gap-1">
                <FaNetworkWired size={12} /> Contract address
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="pt-4 border-t border-[#2A2A3A]">
        <div className="text-[#A0A0FF] mb-2">Network</div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#33AAFF]"></div>
          <div>
            {simulationData.networkDetails
              ? `${simulationData.networkDetails.netName} (Chain ID: ${simulationData.networkDetails.netChainId})`
              : "Mainnet"}
          </div>
        </div>
      </div>
      <div className="pt-4 border-t border-[#2A2A3A]">
        <div className="text-[#A0A0FF] mb-2">Validation</div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {simulationData.isValidReciever ? (
              <>
                <IoMdCheckmarkCircleOutline className="text-[#33FFAA]" />
                <span>Valid recipient address</span>
              </>
            ) : (
              <>
                <FaTimesCircle className="text-[#FF4D4D]" />
                <span>Invalid recipient</span>
              </>
            )}
          </div>
          {simulationData.honeyPotWarning && (
            <div className="mt-3 p-3 bg-[#2A0A0A] border border-[#FFAA33] text-[#FFAA33] rounded-lg">
              <strong>{simulationData.honeyPotWarning.warning}</strong>:{" "}
              {simulationData.honeyPotWarning.message}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
));

// Main Component
function TxSimulationResult({ simulationData }) {
  if (!simulationData) return null;

  return (
    <div className="w-full max-w-5xl mt-6 bg-[#0A0A12]/90 backdrop-blur-lg rounded-xl shadow-2xl border border-[#2A2A3A] overflow-hidden">
      <TxHeader simulationData={simulationData} />
      <div className="p-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FinancialSummary simulationData={simulationData} />

          <TransactionDetails simulationData={simulationData} />
        </div>
      </div>
    </div>
  );
}

export default memo(TxSimulationResult);
