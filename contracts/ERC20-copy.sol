// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.20;

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

// error NOT_OWNER();
// error INSUFFICIENT_FUNDS();
// error AMOUNT_CANT_BE_ZERO();
// error PURCHASE_FAILED();
// error INSUFFICIENT_FUNDS_IN_CONTRACT();


// contract ERC20Token is ERC20, Ownable {

//     uint256 private constant claimTokenRate = 1000; // 0.001 ETH/OKE
//     uint256 public tokensSold;

//     event BuyTokens(address indexed reciever, uint256 value);

//     constructor(address initialOwner, string memory tokenName, string memory symbol)
//         ERC20(tokenName, symbol)
//         Ownable(initialOwner)
//     {
//         _mint(address(this), 1000000 * 10 ** decimals());
//     }

//     function buyToken(address reciever) external payable {
//         if (msg.value <= 0) 
//             revert INSUFFICIENT_FUNDS();

//         uint numTokens = (msg.value * claimTokenRate);

//         if(this.balanceOf(address(this)) <= numTokens)
//           revert INSUFFICIENT_FUNDS_IN_CONTRACT();

//         (bool success, ) = address(this).call{value: msg.value}("");
//         if (!success) 
//             revert PURCHASE_FAILED();
        
//         this.transfer(msg.sender, numTokens);

//         tokensSold += numTokens;

//         emit BuyTokens(reciever, msg.value);
//     }

//     function ownerWithdraw() external onlyOwner payable {
      
//       uint balance = address(this).balance;

//       if (balance <= 0) 
//         revert INSUFFICIENT_FUNDS();

//       payable(this.owner()).transfer(balance);
//     }

//     function withdrawToken(uint256 amount) external onlyOwner {
//       uint balance = this.balanceOf(address(this));

//       if (balance <= amount) 
//         revert INSUFFICIENT_FUNDS();

//       this.transfer(msg.sender, amount);
    
//     }

// }
