import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("TokeSwap", function () {
  async function deployContract() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount, addr1] = await ethers.getSigners();

    const tokenName1 = "WEB3BRIDGEx";
    const tokenSymbol1 = "WC3X";
    const tokenName2 = "Whydeeheem";
    const tokenSymbol2 = "YDM";

    const ERC20 = await ethers.getContractFactory("ERC20Token");
    const WEB3X = await ERC20.deploy(owner.address, tokenName1, tokenSymbol1);
    const YDM = await ERC20.deploy(owner.address, tokenName2, tokenSymbol2);

    const TokenSwap = await ethers.getContractFactory("Swap");

    const TOKENSWAP = await TokenSwap.deploy(
      await WEB3X.getAddress(),
      await YDM.getAddress()
    );

    console.log(`WEB3X contract deployed to ${await WEB3X.getAddress()}`);
    console.log(`YDM contract deployed to ${await YDM.getAddress()}`);

    console.log(
      `TOKENSWAP contract deployed to ${await TOKENSWAP.getAddress()}`
    );

    return { owner, otherAccount, addr1, WEB3X, YDM, TOKENSWAP };
  }

  describe("Deployment", function () {
    it("Should be able to deploy the WEB3X contract", async () => {
      const { WEB3X } = await loadFixture(deployContract);
      expect(WEB3X.target).to.not.equal(0);
    });

    it("Should be able to deploy the YDM contract", async () => {
      const { YDM } = await loadFixture(deployContract);
      expect(YDM.target).to.not.equal(0);
    });

    it("Should be able to deploy the tokenSwap contract", async () => {
      const { TOKENSWAP } = await loadFixture(deployContract);
      expect(TOKENSWAP.target).to.not.equal(0);
    });

    it("Should be able to deploy the WEB3X contract with the right owner", async () => {
      const { owner, WEB3X } = await loadFixture(deployContract);
      expect(await WEB3X.owner()).to.equal(owner.address);
    });

    it("Should be able to deploy the YDM contract with the right owner", async () => {
      const { owner, YDM } = await loadFixture(deployContract);
      expect(await YDM.owner()).to.equal(owner.address);
    });

    it("Should be able to deploy the tokenSwap contract with the right WEB3X address", async () => {
      const { WEB3X, TOKENSWAP } = await loadFixture(deployContract);
      expect(await TOKENSWAP.WEB3X()).to.equal(await WEB3X.getAddress());
    });

    it("Should be able to deploy the tokenSwap contract with the right YDM address", async () => {
      const { YDM, TOKENSWAP } = await loadFixture(deployContract);
      expect(await TOKENSWAP.YDM()).to.equal(await YDM.getAddress());
    });
  });

  describe("Swap", function () {
    it("Should be able to swap WEB3X for YDM", async () => {
      let web3xBalance, ydmBalance;
      const { owner, otherAccount, WEB3X, YDM, TOKENSWAP } = await loadFixture(
        deployContract
      );

      // admin deposit 10000 WEB3X to tokenswap contract
      const depositAmount = ethers.parseUnits("10000", 18);
      await WEB3X.transfer(TOKENSWAP.target, depositAmount);

      // admin deposit 10000 YDM to tokenswap contract
      await YDM.transfer(TOKENSWAP.target, depositAmount);

      const swapAmount = ethers.parseUnits("300", 18);
      // const fundAmount = ethers.parseUnits("500", 18);

      await WEB3X.transfer(otherAccount.address, swapAmount);

      web3xBalance = await WEB3X.balanceOf(otherAccount.address);
      ydmBalance = await YDM.balanceOf(otherAccount.address);

      console.log(
        `WEB3X balance before swap: ${ethers.formatEther(web3xBalance)}`
      );
      console.log(`YDM balance before swap: ${ethers.formatEther(ydmBalance)}`);

      await WEB3X.connect(otherAccount).approve(TOKENSWAP.target, swapAmount);

      await TOKENSWAP.connect(otherAccount).swapWEBX(swapAmount);

      web3xBalance = await WEB3X.balanceOf(otherAccount.address);
      ydmBalance = await YDM.balanceOf(otherAccount.address);

      console.log(`WEB3X balance: ${ethers.formatEther(web3xBalance)}`);
      console.log(`YDM balance: ${ethers.formatEther(ydmBalance)}`);

      expect(web3xBalance).to.equal(0);
      expect(ydmBalance).to.greaterThan(0);
    });

    it("Should not be able to swap WEB3X for YDM no approval", async () => {
      const { owner, otherAccount, WEB3X, YDM, TOKENSWAP } = await loadFixture(
        deployContract
      );

      // admin deposit 10000 WEB3X to tokenswap contract
      const depositAmount = ethers.parseUnits("10000", 18);
      await WEB3X.transfer(TOKENSWAP.target, depositAmount);

      // admin deposit 10000 YDM to tokenswap contract
      await YDM.transfer(TOKENSWAP.target, depositAmount);

      const swapAmount = ethers.parseUnits("300", 18);

      await WEB3X.transfer(otherAccount.address, swapAmount);

      await expect(TOKENSWAP.connect(otherAccount).swapWEBX(swapAmount)).to.be
        .reverted;
    });

    // it("Should be re", async () => {  })
  });

  describe("Admin Deposit", () => {
    it("Should be able to deposit WEB3X to the contract", async () => {
      const { owner, otherAccount, WEB3X, YDM, TOKENSWAP } = await loadFixture(
        deployContract
      );

      const depositAmount = ethers.parseUnits("10000", 18);
      await WEB3X.transfer(TOKENSWAP.target, depositAmount);

      const contractBalance = await WEB3X.balanceOf(TOKENSWAP.target);

      expect(contractBalance).to.equal(depositAmount);
    });

    it("Should be able to deposit YDM to the contract", async () => {
      const { owner, otherAccount, WEB3X, YDM, TOKENSWAP } = await loadFixture(
        deployContract
      );

      const depositAmount = ethers.parseUnits("10000", 18);
      await YDM.transfer(TOKENSWAP.target, depositAmount);

      const contractBalance = await YDM.balanceOf(TOKENSWAP.target);

      expect(contractBalance).to.equal(depositAmount);
    });
  });
});
