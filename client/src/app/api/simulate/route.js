// for nextjs Routes and business logic backend server of next js 

import {ethers} from 'ethers'
import { getBalance, calculateEstimateGas, validateAddress } from '@/app/utils/blockchain'
import dotenv from 'dotenv';

dotenv.config();

export async function POST(request) {
    try {
      const { recipient, amount, userWalletAddress } = await request.json();
      const errors = [];
  
      // Validate user wallet address
      if (!userWalletAddress) {
        errors.push("User wallet address is required");
      }
  
      // Validate recipient address using validateAddress
      if (!validateAddress(recipient)) {
        errors.push("The receiver address is not valid");
      }
  
      // Validate amount (convert to number)
      const _amount = Number(amount);
      if (isNaN(_amount) || _amount <= 0) {
        errors.push("Invalid amount. Must be a positive number.");
      }
  
      // Current ETH balance of user (as a string)
      const userWalletBalance = await getBalance(userWalletAddress);
  
      // Gas estimation
      const gasEstimateResult = await calculateEstimateGas(recipient, amount, userWalletAddress);
      const estimatedGasExtract = gasEstimateResult.gas; // This is a string
  
      // Fetch ETH price from CoinGecko
      const coinGeckoAPI = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd";
      const ethPriceGecko = await fetch(coinGeckoAPI);
      const ethPriceDataInJson = await ethPriceGecko.json();
      const ethUsdGecko = ethPriceDataInJson.ethereum.usd || 0;
  
      // Calculate gas cost in USD and in ETH (using your existing logic)
      const gasCostUsd = (parseFloat(estimatedGasExtract) * ethUsdGecko).toFixed(14);
      const estimateGasCostInEth = (parseFloat(estimatedGasExtract) * 1e9).toFixed(6);
      const totalGasCostInUSD = (gasCostUsd * Number(estimateGasCostInEth)).toFixed(2);
  
      // Compute balance after transaction
      const totalBalanceAfterTx = ethers.formatEther(
        ethers.parseEther(String(userWalletBalance)) -
        ethers.parseEther(String(amount)) -
        ethers.parseEther(String(estimatedGasExtract))
      );
  
      // Calculate total cost of transaction and determine transaction status
      const totalCostOfTx = ethers.parseEther(amount) + ethers.parseEther(totalGasCostInUSD);
      const balanceWei = ethers.parseEther(userWalletBalance);
      const txStatus = balanceWei >= totalCostOfTx 
        ? "Likely to succeed" 
        : "Will Fail due to insufficient funds";
  
      // If transaction is predicted to fail, add a default error reason if none from gas estimation
      let errorReason = gasEstimateResult?.error || null;
      if (!errorReason && txStatus.startsWith("Will Fail")) {
        errorReason = "Insufficient funds to cover the transaction amount and gas fees.";
        errors.push(errorReason);
      }
  
      // Build the JSON response data including errors (if any)
      const responseData = {
        receiverAddress: recipient,
        amount: amount,
        gasCostEth: estimateGasCostInEth,
        gasCostUsd: gasCostUsd,
        balanceAfter: totalBalanceAfterTx,
        balanceBefore: userWalletBalance,
        isValidReciever: validateAddress(recipient),
        transactionStatus: txStatus,
        ethPriceInUsd: ethUsdGecko,
        userAddress: userWalletAddress,
        network: "Ethereum Mainnet",
        ...(gasEstimateResult?.error ? { ErrorReason: gasEstimateResult.error } : {}),
        ...(errors.length > 0 ? { errors } : {}),
      };
  
      return new Response(JSON.stringify(responseData), {
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