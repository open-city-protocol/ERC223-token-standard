pragma solidity ^0.4.24;

import "../../contracts/ERC223_Token.sol";


contract ERC223TokenMock is ERC223Token {
  constructor() public {
    name = "Mock ERC223 Token";
    symbol = "MET"; // todo: ensure unique symbol
    decimals = 18;
    totalSupply = 0xc9f2c9cd04674edea40000000; // 1 trillion coins

    balances[msg.sender] = totalSupply;
  }
}
