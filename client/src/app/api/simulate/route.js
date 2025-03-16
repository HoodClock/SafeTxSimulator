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
      const estimatedGasExtract = gasEstimateResult.data.gas;
  
      // Fetch ETH price from CoinGecko
      const coinGeckoAPI = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd";
      const ethPriceGecko = await fetch(coinGeckoAPI);
      const ethPriceDataInJson = await ethPriceGecko.json();
      const ethUsdGecko = ethPriceDataInJson.ethereum.usd || 0;
  
      // Calculate gas cost in USD and in ETH 
      const estimateGasCostInEth = ethers.formatUnits(estimatedGasExtract, "gwei");
      const gasCostUsd = (Number(estimateGasCostInEth) * ethUsdGecko).toFixed(2);
  
      // Compute balance after transaction
      const totalBalanceAfterTx = ethers.formatEther(
        ethers.parseEther(userWalletBalance)-
        (ethers.parseEther(amount))-
      (ethers.parseUnits(estimatedGasExtract, "gwei"))
      );
  
      // Calculate total cost of transaction and determine transaction status
      const totalCostOfTx = ethers.parseEther(amount) + ethers.parseEther(estimatedGasExtract, "gwei");
      const balanceWei = ethers.parseEther(userWalletBalance);
      const txStatus = balanceWei > totalCostOfTx 
        ? "Likely to succeed" 
        : "Will Fail";
  
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
        gasCostEth: estimateGasCostInEth.toString(),
        gasCostUsd: gasCostUsd.toString(),
        balanceAfter: totalBalanceAfterTx.toString(),
        balanceBefore: userWalletBalance.toString(),
        isValidReciever: validateAddress(recipient),
        transactionStatus: txStatus,
        ethPriceInUsd: ethUsdGecko,
        userAddress: userWalletAddress,
        networkDetails: {
          ...gasEstimateResult.data.network,
          netChainId: gasEstimateResult.data.network.netChainId.toString()
      },
        isRecieverContract: gasEstimateResult.data.isContract,
        transactionType: gasEstimateResult.data.txType,
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