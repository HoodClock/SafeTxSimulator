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
export const calculateEstimateGas  = async (_to, _amount, _from)=> {

    const _trasnaction = {
        to : _to,
        value : ethers.parseEther(_amount),
        from : _from
    }
  
    try {
      
      // estimate the tx
      const gas = await alchemyProvider.estimateGas({
        ..._trasnaction,
        gasLimit: ethers.parseUnits("1000000", "wei"),
      });
      
      // getMaxPriorityFee
      const feeData = await alchemyProvider.getFeeData();

      // latest block Number
      const latestBlock = await alchemyProvider.getBlockNumber()

      const netName = "homestead";
      const netChainId = 1;

      // tx-type [type-2 {EIP-1559}, type-0 {Legacy}]
      const txType = feeData.maxPriorityFeePerGas ? 2 : 0

      // to check if reciever is contract
      const isContract = (await alchemyProvider.getCode(_to)) !== "0x";

      const returnData = {
        gas: gas.toString(),
        gasPrice: ethers.formatUnits(feeData.gasPrice, "gwei"),
        feeData : ethers.formatUnits(feeData.maxPriorityFeePerGas, "gwei"),
        maxFeeData: ethers.formatUnits(feeData.maxFeePerGas, "gwei"),
        blockNumber: latestBlock,
        network : {netName: netName, netChainId: netChainId},
        txType: txType,
        isContract: isContract,
      }
      
      // for the true or false error (if Any)
      return {success: true, data: returnData};

    } catch (error) {
      const netName = "homestead"; // Mainnet
    const netChainId = 1;
      return { success: false, error: error.shortMessage || error.message || "Unknown error", data: {gas: "21000"},network: { netName: netName, netChainId: netChainId }, };
    }
  }
  

// to check if the recipient address is a valid ethereum address or not ?
export const validateAddress = (_address)=> {
    const validatedAddress = ethers.isAddress(_address);
    return validatedAddress;
}

