//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NielsCoin is ERC20, Ownable {
    using SafeMath for uint256;

    constructor(uint256 initialSupply) public ERC20("NielsCoin", "NCOIN") {
      _mint(msg.sender, initialSupply);
    }
}
