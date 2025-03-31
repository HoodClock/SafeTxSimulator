// for nextjs Routes and business logic backend server of next js

import { ethers } from "ethers";
import {
  getBalance,
  calculateEstimateGas,
  validateAddress,
} from "@/app/utils/blockchain";
import dotenv from "dotenv";

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
    const gasEstimateResult = await calculateEstimateGas(
      normalizedRecipient,
      amount,
      userWalletAddress
    );

    const estimatedGasExtract = gasEstimateResult.success
      ? gasEstimateResult.data.gas
      : "0";

    // Fetch ETH price from CoinGecko
    const coinGeckoAPI =
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd";
    const ethPriceGecko = await fetch(coinGeckoAPI);
    const ethPriceDataInJson = await ethPriceGecko.json();
    const ethUsdGecko = ethPriceDataInJson?.ethereum?.usd || 0;

    // Calculate gas cost in USD and in ETH
    const estimateGasCostInEth = ethers.formatUnits(
      estimatedGasExtract || 0,
      "gwei"
    );
    const gasCostUsd = (Number(estimateGasCostInEth) * ethUsdGecko).toFixed(2);

    // Compute balance after transaction
    const totalBalanceAfterTx = estimatedGasExtract
      ? ethers.formatEther(
          ethers.parseEther(userWalletBalance) -
            ethers.parseEther(amount) -
            ethers.parseUnits(estimatedGasExtract, "gwei")
        )
      : "0.0";

    // Calculate total cost of transaction and determine transaction status
    const totalCostOfTx =
      ethers.parseEther(amount) +
      ethers.parseUnits(estimatedGasExtract, "gwei");
    const balanceWei = ethers.parseEther(userWalletBalance);

    // all error possiblities
    const txStatus =
      balanceWei <= 0
        ? "Will Fail (❌ Empty wallet - 0 ETH balance)"
        : totalCostOfTx <= 0
        ? "Will Fail (⚠️ Invalid transaction - zero/negative cost)"
        : balanceWei > (totalCostOfTx * 11n) / 10n
        ? "✅ Likely to succeed (10%+ gas buffer)"
        : balanceWei > totalCostOfTx
        ? "⚠️ Risky (Low gas buffer <10%)"
        : balanceWei === totalCostOfTx
        ? "Will Fail (🛑 Exact amount - no gas buffer)"
        : "Will Fail (💸 Insufficient funds)";

    // Improved errorReasons with actionable messages
    const errorReasons = {
      "Empty wallet": `Deposit ${ethers.formatEther(
        totalCostOfTx
      )} ETH to proceed`,
      "Invalid transaction": "Check amount and gas parameters",
      Risky: `Add ${ethers.formatEther(
        (totalCostOfTx * 10n) / 100n
      )} ETH (10% buffer recommended)`,
      "Exact amount": `Send at least ${ethers.formatEther(
        (totalCostOfTx * 105n) / 100n
      )} ETH (5% buffer)`,
      "Insufficient funds": `Missing ${ethers.formatEther(
        totalCostOfTx - balanceWei
      )} ETH`,
    };

    //  Smarter errorReason handling (preserves original flow)
    if (!errorReasons && txStatus.startsWith("Will Fail")) {
      const failReason =
        txStatus.match(/\((.*?)\)/)?.[1]?.split(" ")[0] || "Transaction failed";
      errorReasons =
        errorReasons[failReason] ||
        `Insufficient funds (needs ${weiToEth(totalCostOfTx)} ETH total)`;
      if (!errors.includes(errorReasons)) errors.push(errorReasons);
    }

    // Enhanced honeypot detection
    let honeyPotWarning = null;

    // isContract Honey-pot
    if (gasEstimateResult.data.isContract) {
      honeyPotWarning = {
        warning: "⚠️ Smart Contract Detected",
        message: gasEstimateResult.data.isSuspicious
          ? "🚨 High risk: Potential honeypot (many txns, low balance)"
          : "Verify contract safety before proceeding",
      };
    }

    // High Tax honey-pot
    if (gasEstimateResult.data.isHighGas) {
      honeyPotWarning = {
        warning: "⚠️ High Gas Fees Detected",
        message:
          "🚨 This transaction may have an abnormally high tax, possibly a honeypot!"
      };
    }

    // Build the JSON response data including errors (if any)
    const responseData = {
      gasCostEth: estimateGasCostInEth.toString(),
      gasCostUsd: gasCostUsd.toString(),
      isValidReciever: validateAddress(normalizedRecipient),
      transactionStatus: txStatus,
      transactionType: gasEstimateResult.success ? gasEstimateResult.data.txType : 0,
      amount: amount,
      balanceBefore: Number(userWalletBalance).toFixed(6),
      balanceAfter: Number(totalBalanceAfterTx).toFixed(6),
      ethPriceInUsd: ethUsdGecko,
      userAddress: userWalletAddress,
      receiverAddress: normalizedRecipient,
      isContract: gasEstimateResult.data.isContract,
      honeyPotWarning: honeyPotWarning || "No Honey pot detected",
      networkDetails: {
        netName: gasEstimateResult.data.network.netName,
        netChainId: gasEstimateResult.data.network.chainId.toString(),
      },
      minimumRequired: ethers.formatEther(totalCostOfTx),
      recommendedAmount: ethers.formatEther((totalCostOfTx * 11n) / 10n),
      ...(gasEstimateResult?.error && { ErrorReason: gasEstimateResult.error }),
      ...(errors.length > 0 && { errors }),
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
