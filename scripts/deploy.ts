import { ethers } from "hardhat";

async function main() {
  const initialOwner = "0x77158c23cc2d9dd3067a82e2067182c85fa3b1f6";

  const WC3XContract = await ethers.deployContract("ERC20Token", [
    initialOwner,
    "WEB3BRIDGEx",
    "WC3X",
  ]);

  await WC3XContract.waitForDeployment();

  console.log(`First ERC20 Token contract deployed to ${WC3XContract.target}`);

  const YDMContract = await ethers.deployContract("ERC20Token", [
    initialOwner,
    "Whydeeheem",
    "YDM",
  ]);

  await YDMContract.waitForDeployment();

  console.log(`Second ERC20 Token contract deployed to ${YDMContract.target}`);

  const TOKENSWAP = await ethers.deployContract("Swap", [
    WC3XContract.target,
    YDMContract.target,
  ]);

  await TOKENSWAP.waitForDeployment();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// npx hardhat run scripts/deploy.ts --network sepolia
