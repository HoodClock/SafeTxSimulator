// Configuration file of Blockchain

import ethers, { isAddress } from "ethers"
import dotenv from "dotenv"


dotenv.config();

const alchemyProvider = new ethers.JsonRpcProvider(process.env.ETH_MAINNET_APIKEY)


// wallet provider function
const getWalletProvider = async ()=> {
    if (window.ethereum){
        return new ethers.BrowserProvider(window.ethereum);
    }
    throw new Error("No Wallet Provided") 
}

// to connect Wallet
export const connectWallet  = async ()=>{
    const provider = getWalletProvider();
    await provider.send("eth_requestAccounts", []);
    const signer = (await provider).getSigner();

    return {provider, signer}
}

// to get a balance using alchemy Provider built-in function 
export const getBalance = async (_address)=> {
    const balance = await alchemyProvider.getBalance(_address);
    return ethers.formatEther(balance);
}

// now to calculate the estimated gas 
export const calculateEstimateGas  = async (_to, _amount, _from)=> {
    // onj of tx
    const _trasnaction = {
        _to,
        value : ethers.formatEther(_amount),
        _from
    }

    const calculatedGas = await alchemyProvider.estimateGas(_trasnaction);

    return ethers.formatEther(calculatedGas);
}

// to check if the recipient address is a valid ethereum address or not ?
export const validateAddress = async(_address)=> {
    const validatedAddress = ethers.isAddress(_address);
    
    if(!validateAddress){
        return false
    }
    
    return validatedAddress;
}

