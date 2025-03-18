// Configuration file of Blockchain

import {ethers, FeeDataNetworkPlugin} from "ethers"
import dotenv from "dotenv"


dotenv.config();

const isLocal = false; // must set to false if using Alchemy



const ganacheAPiKey = process.env.GANACHE_LOCAL_NETWORK;
const alchemyApiKey = process.env.ETH_MAINNET_APIKEY;

const providerUrl = isLocal ? "http://127.0.0.1:8545" : `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`
console.log("Provider URL:", providerUrl);

const alchemyProvider = new ethers.JsonRpcProvider(providerUrl);


// wallet provider function
const getWalletProvider = async ()=> {
    if (typeof window !== "undefined" && window.ethereum) {
        return new ethers.BrowserProvider(window.ethereum);
      }
      throw new Error("No wallet detected");
}

// to connect Wallet
const connectWallet  = async ()=>{
    try {
        const provider = await getWalletProvider();
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        return { provider, signer };
      } catch (error) {
        console.error("Wallet connection failed:", error);
        throw error;
      }
}

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

      // for network 
      // const network = await alchemyProvider.getNetwork();

      // FOR USING LOCAL NETWORK
      // const netName = network.name;
      // const netChainId = network.chainId;

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
      return { success: false, error: error.shortMessage || error.message || "Unknown error", data: {gas: "21000"} };
    }
  }
  

// to check if the recipient address is a valid ethereum address or not ?
export const validateAddress = (_address)=> {
    const validatedAddress = ethers.isAddress(_address);
    return validatedAddress;
}

export default connectWallet;

