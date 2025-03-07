// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract SafeTxSim {

    event SafeTx(address sender, address recipent, uint256 amount);

    function safeTransactionSimulator(address recipent, uint256 amount) public {

        emit SafeTx(msg.sender, recipent, amount);
        
        }

}