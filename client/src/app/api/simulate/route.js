// for nextjs Routes and business logic backend server of next js 

import ethers, { formatEther, Network } from 'ethers'
import { connectWallet, getBalance, calculateEstimateGas, validateAddress } from '@/app/utils/blockchain'
import dotenv from 'dotenv';

dotenv.config();

export async function POST(request) {

    const {receiver, amount} = await request.JSON();
    
    const coinGekco = process.env.COIN_GECKO_API;

    // getting user wallet from the exported function
    const {signer} = await connectWallet();
    const userWalletAddress = (await signer).getAddress();

    // current ETH balance of user
    const userWalletBalance = await getBalance(userWalletAddress);

    const estimatedGasExtract = await calculateEstimateGas(receiver, amount, userWalletAddress)

    // to fetch the ether price in real time from coin Gecko
    const ethPriceGecko = await fetch(coinGekco);
    const ethPriceDataInJson = await ethPriceGecko.json();
    const ethUsdGecko = ethPriceDataInJson.ethereum.usd;

    // calculate Gas Cost in USD
    const estimateGasCostInEth = await ethers.formatEther(estimatedGasExtract);
    const totalGasCostInUSD = (ethUsdGecko * estimateGasCostInEth).toFixed(2);  

    // computing balance amount after tx
    const totalBalanceAfterTx = ethers.formatEther(ethers.parseEther(userWalletBalance) - ethers.parseEther(amount) - ethers.parseEther(totalGasCostInUSD));

    // validating reciever address
    const isValidReciever = validateAddress(receiver);

    // Check for transaction (success/faliure) rate
    const totalCostOfTx = ethers.parseEther(amount) + ethers.parseEther(totalGasCostInUSD);
    
    const balanceWei = ethers.parseEther(userWalletBalance);
    
    const txStatus = balanceWei >= totalCostOfTx ? "Likely to succeed" : "Will Fail";



    return new Response(JSON.stringify({
        receiverAddress: receiver,
        amount : amount,
        gasCostEth : estimateGasCostInEth,
        gasCostUsd : totalGasCostInUSD,
        balanceBefore : userWalletBalance,
        balanceAfter : totalBalanceAfterTx,
        isValidReciever : isValidReciever,
        transactionStatus : txStatus,
        ethPriceInUsd :  ethUsdGecko,
        userAddress : userWalletAddress,
        nounce : (await signer).getNonce(),
        network : "Ethereum Mainnet"
     }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
}