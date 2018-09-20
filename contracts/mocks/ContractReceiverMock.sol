pragma solidity ^0.4.24;

import "../../contracts/Receiver_Interface.sol";


contract ContractReceiverMock is ContractReceiver {
  address public from;
  uint256 public value;
  bytes public data;
  string public fallback;

  function tokenFallback(address _from, uint256 _value, bytes _data) public {
    from = _from;
    value = _value;
    data = _data;
    fallback = "tokenFallback(address,uint256,bytes)";
  }

  function customTokenFallback(address _from, uint256 _value, bytes _data) public {
    from = _from;
    value = _value;
    data = _data;
    fallback = "customTokenFallback(address,uint256,bytes)";
  }
}
