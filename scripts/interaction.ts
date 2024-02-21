import { ethers } from "hardhat";

const OWNER_ADDRESS = "0x77158c23cc2d9dd3067a82e2067182c85fa3b1f6";

const ERC20_TOKEN = "0xE954878393472aeBCa0450E7A5d0e3d4E21a119E";

async function interact() {
  const erc20Token = await ethers.getContractAt("ERC20Token", ERC20_TOKEN);

  const buyToken = await erc20Token.buyToken(OWNER_ADDRESS);

  buyToken.wait();

  console.log(`The ERC20 tokens are bought successfully`);
  

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
interact().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// npx hardhat run scripts/interaction.ts --network sepolia
