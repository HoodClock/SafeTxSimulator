// for nextjs Routes and business logic backend server of next js 

import {ethers} from 'ethers'
import { getBalance, calculateEstimateGas, validateAddress } from '@/app/utils/blockchain'
import dotenv from 'dotenv';

dotenv.config();

export async function POST(request) {
    try {

    const {recipient, amount, userWalletAddress } = await request.json();

    if (!userWalletAddress) {
      return new Response(JSON.stringify({ error: "User wallet address is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    

    // validating reciever address
    const isValidReciever = validateAddress(recipient);
    if(!isValidReciever){
      return new Response(JSON.stringify({error:"The reciever address is not valid"}));
    }
    
    const _amount = Number(amount)
    if (isNaN(Number(_amount))||Number(_amount) <= 0) {
      return new Response(JSON.stringify({ error: "Invalid amount. Must be a positive number." }));
    }
    
    // const coinGekcoAPI = process.env.COIN_GECKO_API;

    // current ETH balance of user
    const userWalletBalance = await getBalance(userWalletAddress);


    const gasEstimateResult = await calculateEstimateGas(recipient, amount, userWalletAddress);

    const estimatedGasExtract = gasEstimateResult.gas;

    // to fetch the ether price in real time from coin Gecko
    const coinGeckoAPI = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd";

    const ethPriceGecko = await fetch(coinGeckoAPI)

    const ethPriceDataInJson = await ethPriceGecko.json();
    
    const ethUsdGecko = ethPriceDataInJson.ethereum.usd || 0;
    
    const gasCostUsd = (parseFloat(estimatedGasExtract) * 
    ethUsdGecko).toFixed(14);

    // calculate Gas Cost in USD
    const estimateGasCostInEth = (parseFloat(estimatedGasExtract) * 1e9).toFixed(6);
    const totalGasCostInUSD = (gasCostUsd * Number( estimateGasCostInEth)).toFixed(2);  

    // computing balance amount after tx
    const totalBalanceAfterTx = ethers.formatEther(ethers.parseEther(String(userWalletBalance)) - ethers.parseEther(String(amount)) - ethers.parseEther(String(estimatedGasExtract)));


    // Check for transaction (success/faliure) rate
    const totalCostOfTx = ethers.parseEther(amount) + ethers.parseEther(totalGasCostInUSD);
    
    const balanceWei = ethers.parseEther(userWalletBalance);
    
    const txStatus = balanceWei >= totalCostOfTx ? "Likely to succeed" : "Will Fail";

    return new Response(JSON.stringify({
        receiverAddress: recipient,
        amount : amount,
        gasCostEth : estimateGasCostInEth,
        gasCostUsd : gasCostUsd,
        balanceAfter : totalBalanceAfterTx,
        balanceBefore : userWalletBalance,
        isValidReciever : isValidReciever,
        transactionStatus : txStatus,
        ethPriceInUsd :  ethUsdGecko,
        userAddress : userWalletAddress,
        network : "Ethereum Mainnet",
        ...(gasEstimateResult.error && {ErrorReason:gasEstimateResult.error}) // only add when there is really a error
     }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

    } catch (error) {
      console.error("Simulation error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    }); 
    }
}