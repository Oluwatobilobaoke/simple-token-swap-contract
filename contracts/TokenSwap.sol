
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IERC20.sol";

error NOT_OWNER();
error INSUFFICIENT_FUNDS();
error AMOUNT_CANT_BE_ZERO();
error SWAP_FAILED();
error INSUFFICIENT_FUNDS_IN_CONTRACT();
error EXCHANGE_AMOUNT_MUST_BE_GREATER_THAN_ZERO();
error EXCHANGE_INSUFFICIENT_FUNDS();


contract Swap {
  address owner;

  uint256 ratioAX;
  uint256 fees;

  IERC20 public WEB3X;

  IERC20 public YDM;

    constructor(address web3xToken, address ydmToken) {
      owner = msg.sender;
      WEB3X = IERC20(web3xToken);
      YDM = IERC20(ydmToken);

      fees = 2;
      ratioAX = 5;


      WEB3X.approve(address(this), WEB3X.totalSupply());
      YDM.approve(address(this), YDM.totalSupply());
    }

    function setRatio(uint256 _ratio) external onlyAdmin {
        ratioAX = _ratio;
    }

    function getRatio() external view onlyAdmin returns (uint256) {
        return ratioAX;
    }

    function setFees(uint256 _Fees) external onlyAdmin {
        fees = _Fees;
    }

    function getFees() external view onlyAdmin returns (uint256) {
        return fees;
    }


    function swapWEBX(uint256 amount) external returns (uint256) {

      if(amount<= 0 )
        revert AMOUNT_CANT_BE_ZERO();

      if (WEB3X.balanceOf(msg.sender) < amount) {
        revert INSUFFICIENT_FUNDS();
      }

      uint256 exchangeA = (amount * ratioAX);

      uint256 exchangeAmount = exchangeA - ((exchangeA * fees) / 100);

      if(exchangeAmount < 0 )
          revert EXCHANGE_AMOUNT_MUST_BE_GREATER_THAN_ZERO();

      if(YDM.balanceOf(address(this)) < exchangeAmount)
        revert EXCHANGE_INSUFFICIENT_FUNDS();

      WEB3X.transferFrom(msg.sender, address(this), amount);

      YDM.approve(address(msg.sender), exchangeAmount);

      YDM.transferFrom(
          address(this),
          address(msg.sender),
          exchangeAmount
      );
      
      return exchangeAmount;
    }


    function depositTokenWEB3X(uint256 amount) external onlyAdmin {
      if(amount<= 0 )
        revert AMOUNT_CANT_BE_ZERO();
      
      uint256 balance = WEB3X.balanceOf(msg.sender);

      if (amount > balance)
        revert INSUFFICIENT_FUNDS();

      WEB3X.transferFrom(msg.sender, address(this), amount);
    }



    function depositTokenYDM(uint256 amount) external onlyAdmin {

      if(amount<= 0 )
        revert AMOUNT_CANT_BE_ZERO();
      
      uint256 balance = YDM.balanceOf(msg.sender);

      if (amount > balance)
        revert INSUFFICIENT_FUNDS();

      YDM.transferFrom(msg.sender, address(this), amount);
    }

      modifier onlyAdmin() {
      payable(msg.sender) == owner;
      _;
    }

}