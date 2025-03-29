// for nextjs Routes and business logic backend server of next js 

import {ethers} from 'ethers'
import { getBalance, calculateEstimateGas, validateAddress } from '@/app/utils/blockchain'
import dotenv from 'dotenv';

dotenv.config();

export async function POST(request) {
    try {
      const { recipient, amount, userWalletAddress } = await request.json();
      const errors = [];

      let normalizedRecipient;
      try {
        normalizedRecipient = ethers.getAddress(recipient.trim().toLowerCase());
      } catch (error) {
        errors.push("Invalid receiver address");
      }
  
      // Validate user wallet address and reciever
      if (!userWalletAddress) errors.push("User wallet address is required");
  
      // Validate amount (convert to number)
      const _amount = Number(amount);
      if (isNaN(_amount) || _amount <= 0) {
        errors.push("Invalid amount. Must be a positive number.");
      }
  
      // Early return if validation errors
      if (errors.length > 0) {
        return new Response(JSON.stringify({ errors }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Current ETH balance of user (as a string)
      const userWalletBalance = await getBalance(userWalletAddress);
      // const userWalletBalance = "0.01"
  
      // Gas estimation
      const gasEstimateResult = await calculateEstimateGas(normalizedRecipient, amount, userWalletAddress);
      
      const estimatedGasExtract = gasEstimateResult.success ? gasEstimateResult.data.gas : "0";

  
      // Fetch ETH price from CoinGecko
      const coinGeckoAPI = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd";
      const ethPriceGecko = await fetch(coinGeckoAPI);
      const ethPriceDataInJson = await ethPriceGecko.json();
      const ethUsdGecko = ethPriceDataInJson?.ethereum?.usd || 0;
  
      // Calculate gas cost in USD and in ETH 
      const estimateGasCostInEth = ethers.formatUnits(estimatedGasExtract || 0, "gwei");
      const gasCostUsd = (Number(estimateGasCostInEth) * ethUsdGecko).toFixed(2);
  
      // Compute balance after transaction
      const totalBalanceAfterTx = estimatedGasExtract ? ethers.formatEther(
        ethers.parseEther(userWalletBalance) -
        ethers.parseEther(amount) -
        ethers.parseUnits(estimatedGasExtract, "gwei")
      ) : "0.0";
  
      // Calculate total cost of transaction and determine transaction status
      const totalCostOfTx = ethers.parseEther(amount) + ethers.parseUnits(estimatedGasExtract, "gwei");
      const balanceWei = ethers.parseEther(userWalletBalance);
      const txStatus = balanceWei >= totalCostOfTx 
        ? "Likely to succeed" 
        : "Will Fail";
  
      // If transaction is predicted to fail, add a default error reason if none from gas estimation
      let errorReason = gasEstimateResult?.error || null;
      console.log(errorReason)
      if (!errorReason && txStatus.startsWith("Will Fail")) {
        errorReason = "Insufficient funds to cover the transaction amount and gas fees.";
        errors.push(errorReason);
      }
  
      // to check for contract and if (honeypot)
      let honeyPotWarning = null;
      if (gasEstimateResult.data.isContract){
        honeyPotWarning = "This is a smart contract. Verify its safety before sending real funds"
        if (gasEstimateResult.data.isSuspicious){
          honeyPotWarning += "Warning: High transaction count with low balance detected."
        }
      }



      
      // Build the JSON response data including errors (if any)
      const responseData = {
        gasCostEth: estimateGasCostInEth.toString(),
        gasCostUsd: gasCostUsd.toString(),
        isValidReciever: validateAddress(normalizedRecipient),
        transactionStatus: txStatus,
        transactionType: gasEstimateResult.success ? gasEstimateResult.data.txType : 0,
        ...(gasEstimateResult?.error ? { ErrorReason: gasEstimateResult.error } : {}),
        ...(errors.length > 0 ? { errors } : {}),
        amount: amount,
        balanceBefore: userWalletBalance.toString(),
        balanceAfter: totalBalanceAfterTx.toString(),
        ethPriceInUsd: ethUsdGecko,
        userAddress: userWalletAddress,
        receiverAddress: normalizedRecipient,
        isContract: gasEstimateResult.data.isContract,
        honeyPotWarning: honeyPotWarning || null,
        ...(gasEstimateResult?.error ? { ErrorReason: gasEstimateResult.error } : {}),
        networkDetails: {
          netName: gasEstimateResult.data.network.netName,
          netChainId: gasEstimateResult.data.network.chainId.toString()
      },
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
