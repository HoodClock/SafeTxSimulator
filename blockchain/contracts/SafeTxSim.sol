// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract SafeTxSim {


    struct simulatedTx = {
        address sender;
        address recipient;
        uint256 amount;
        uint gasEstimation;
    }

    address public ownerAddress;
    uint156 public gasEstimate

    // initializing contract with owner address
    constructor(){
        ownerAddress = msg.sender
    }


    event SafeTx(address indexed sender, address indexed recipent, uint256 amountm uint256 gasEstimate);

    function simulatedTrasnaction(address _recipient, uint256 _amount ) external {
        simulatedTx memory newTx =  simulatedTx(msg.sender, _recipient, _amount, 
        // need to be implemented the gas Estimation through custom function estimateGas
        )
    }
}