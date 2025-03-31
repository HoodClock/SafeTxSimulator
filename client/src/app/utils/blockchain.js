// Configuration file of Blockchain

import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const isSepolia = true; // must set to false if using Alchemy

// my _envs
const ganacheAPiKey = process.env.GANACHE_LOCAL_NETWORK;
const alchemyApiKey = process.env.ETH_MAINNET_APIKEY;

const providerUrl = isSepolia
  ? `https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`
  : `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`;

const alchemyProvider = new ethers.JsonRpcProvider(providerUrl);

const network = await alchemyProvider.getNetwork();
let netName = network.name;
let chainId = Number(network.chainId);

// Wallet provider function for _wagmi
export const getWalletProvider = async (wagmiProvider) => {
  if (typeof window !== "undefined" && wagmiProvider) {
    return new ethers.BrowserProvider(wagmiProvider);
  }
  throw new Error("No wallet detected");
};

// to get a balance using alchemy Provider built-in function
export const getBalance = async (_address) => {
  const balance = await alchemyProvider.getBalance(_address);
  return ethers.formatEther(balance);
};

// now to calculate the estimated gas
export const calculateEstimateGas = async (_to, _amount, _from) => {
  const _trasnaction = {
    to: _to,
    value: ethers.parseEther(_amount),
    from: _from,
  };

  // Initialize all variables used in both try/catch at the top
  let gas = null;
  let feeData = null;
  let latestBlock = null;
  let txType = 0;
  let isSuspicious = false;
  let isContract = false;
  let isHighGas = false;

  //   HONEY-POT BASIC DETECTION
  const code = await alchemyProvider.getCode(_to);
  isContract = code !== "0x";

  //   now detect basic honeypot
  if (isContract) {
    const balance = await alchemyProvider.getBalance(_to);
    const txCount = await alchemyProvider.getTransactionCount(_to);

    isSuspicious = balance < ethers.parseEther("0.05") && txCount > 30; // Arbitrary threshold

    // Bytecode pattern check (simplified)
    if (code.includes("SELFDESTRUCT") || code.length < 200) {
      isSuspicious = true; // Self-destruct or tiny bytecode = red flag
    }
  }

  //   withdraw honeypot
  try {
    const contract = new ethers.Contract(
      _to,
      ["function withdraw()"],
      alchemyProvider
    );
    await contract.withdraw({ from: _from });
  } catch (error) {
    // if the withdrawls fails its likely the honeypot
    isSuspicious = true;
  }

  try {
    // Then estimate gas
    gas = await alchemyProvider.estimateGas({
      // just change estimateGas => call
      ..._trasnaction,
      gasLimit: ethers.parseUnits("1000000", "wei"),
    });

    // Get other data
    feeData = await alchemyProvider.getFeeData();
    latestBlock = await alchemyProvider.getBlockNumber();
    txType = feeData.maxPriorityFeePerGas ? 2 : 0;

    // check for GasHigh Potential Honeypot
    isHighGas = gas > ethers.parseUnits("500000", "wei"); // 5 second threshold

    return {
      success: true,
      data: {
        gas: gas.toString(),
        gasPrice: ethers.formatUnits(feeData.gasPrice, "gwei"),
        feeData: ethers.formatUnits(feeData.maxPriorityFeePerGas, "gwei"),
        maxFeeData: ethers.formatUnits(feeData.maxFeePerGas, "gwei"),
        blockNumber: latestBlock,
        network: { netName, chainId },
        txType: txType,
        isContract: isContract,
        isSuspicious: isSuspicious,
        isHighGas: isHighGas,
      },
    };
  } catch (error) {
    // If gas estimation fails, it might be a honeypot (revert trap)
    if (error.reason?.includes("revert")) {
      isSuspicious = true;
    }

    return {
      success: false,
      error: error.shortMessage || error.message || "Unknown error",
      data: {
        gas: gas?.toString() || null,
        gasPrice: feeData ? ethers.formatUnits(feeData.gasPrice, "gwei") : null,
        network: { netName, chainId },
        txType: txType,
        isContract: isContract,
        isSuspicious: isSuspicious,
      },
    };
  }
};

// to check if the recipient address is a valid ethereum address or not ?
export const validateAddress = (_address) => {
  try {
    ethers.getAddress(_address.trim().toLowerCase());
    return true;
  } catch (error) {
    return false;
  }
};
