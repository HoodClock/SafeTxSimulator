// Configuration file of Blockchain

import {ethers, FeeDataNetworkPlugin} from "ethers"
import dotenv from "dotenv"


dotenv.config();

const isLocal = false; // must set to false if using Alchemy

// my _envs
const ganacheAPiKey = process.env.GANACHE_LOCAL_NETWORK;
const alchemyApiKey = process.env.ETH_MAINNET_APIKEY;

const providerUrl = isLocal ? "http://127.0.0.1:8545" : `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`
console.log("Provider URL:", providerUrl);

const alchemyProvider = new ethers.JsonRpcProvider(providerUrl);


// Wallet provider function for _wagmi
export const getWalletProvider = async (wagmiProvider) => {
  if (typeof window !== "undefined" && wagmiProvider) {
    return new ethers.BrowserProvider(wagmiProvider);
  }
  throw new Error("No wallet detected");
};

// to get a balance using alchemy Provider built-in function 
export const getBalance = async (_address)=> {
    const balance = await alchemyProvider.getBalance(_address);
    return ethers.formatEther(balance);
}

// now to calculate the estimated gas 
export const calculateEstimateGas = async (_to, _amount, _from) => {
  const _trasnaction = {
      to: _to,
      value: ethers.parseEther(_amount),
      from: _from
  };
  
  // Initialize all variables used in both try/catch at the top
  let isContract = false;
  let netName = "homestead";
  let netChainId = 1;
  let gas = null;
  let feeData = null;
  let latestBlock = null;
  let txType = 0;

  try {
      // Check contract status first
      isContract = (await alchemyProvider.getCode(_to)) !== "0x";
      
      // Then estimate gas
      gas = await alchemyProvider.estimateGas({
          ..._trasnaction,
          gasLimit: ethers.parseUnits("1000000", "wei"),
      });

      // Get other data
      feeData = await alchemyProvider.getFeeData();
      latestBlock = await alchemyProvider.getBlockNumber();
      txType = feeData.maxPriorityFeePerGas ? 2 : 0;

      return {
          success: true,
          data: {
              gas: gas.toString(),
              gasPrice: ethers.formatUnits(feeData.gasPrice, "gwei"),
              feeData: ethers.formatUnits(feeData.maxPriorityFeePerGas, "gwei"),
              maxFeeData: ethers.formatUnits(feeData.maxFeePerGas, "gwei"),
              blockNumber: latestBlock,
              network: { netName, netChainId },
              txType,
              isContract,
          }
      };

  } catch (error) {
      // Fallback contract check if initial check failed
      try {
          isContract = (await alchemyProvider.getCode(_to)) !== "0x";
      } catch (e) {
          console.error("Contract check failed:", e.message);
      }

      return {
          success: false,
          error: error.shortMessage || error.message || "Unknown error",
          data: {
              isContract,
              gas: gas?.toString() || null,
              gasPrice: feeData ? ethers.formatUnits(feeData.gasPrice, "gwei") : null,
              network: { netName, netChainId }
          },
          network: { netName, netChainId }
      };
  }
};
  

// to check if the recipient address is a valid ethereum address or not ?
export const validateAddress = (_address)=> {
    const validatedAddress = ethers.isAddress(_address);
    return validatedAddress;
}

