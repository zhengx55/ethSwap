// smart contract of Eth Swap
pragma solidity ^0.5.0;

import "./Token.sol";

contract EthSwap {
    // state variables, stored in the blockchain, can use as getter
    string public name = "EthSwap Instant Exchange";
    Token public token;
    uint256 public rate = 100;

    event TokenPurchased(
        address account,
        address token,
        uint256 amount,
        uint256 rate
    );

    // param: token.address
    constructor(Token _token) public {
        token = _token;
    }

    // transfer tokens to buyer
    // msg is a global var in solidity, sender will be the person call the function
    function buyTokens() public payable {
        // calc the number of tokens to buy
        uint256 tokenAmount = msg.value * rate;
        // amount of Eth *Redemption rate(# of tokens they receive of 1 ether)

        // require the EthSwap has enouth tokens
        require(token.balanceOf(address(this)) >= tokenAmount);

        token.transfer(msg.sender, tokenAmount);

        // Emit on event
        emit TokenPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    function sellTokens(uint256 _amount) public {
        // calculate the amount of Ether to redeem
        uint256 etherAmount = _amount / rate;
        // maker sure the EtherSwap greter than amount
        require(address(this).balance >= etherAmount);
        // perform sale operation
        token.transferFrom(msg.sender, address(this), _amount);
        msg.sender.transfer(etherAmount);
    }
}
