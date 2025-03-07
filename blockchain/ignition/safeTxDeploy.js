const hardhatEv = require("hardhat")

async function main(){
    const SafeTxSim = await hardhatEv.ethers.getContractFactory("SafeTxSim");
    const safeTx = await SafeTxSim.deploy();

    console.log(`SafeTxSim deployed to ${await safeTx.getAddress()}`);

}

main().catch((error) => {
    console.error(error)
    process.exit(1);
});