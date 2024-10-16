import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("SnickerdoodleFactory", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOperatorGateway() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const gateway = await hre.ethers.deployContract("OperatorGateway", []);
    await gateway.initialize(
      [owner.address],
      "0x000000000000000000000000000000000000dEaD",
    );

    const gatewayBeacon = await hre.ethers.deployContract("UpgradeableBeacon", [
      await gateway.getAddress(),
      owner.address,
    ]);

    return {
      gateway,
      gatewayBeacon,
      owner,
      otherAccount,
    };
  }

  async function deployWallet() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const sdwallet = await hre.ethers.deployContract("SnickerdoodleWallet", []);
    await sdwallet.initialize(
      owner.address,
      {
        keyId: "1337",
        x: "0x2e0aa0b0dd416999b35cf3d03c2df3d4487cefae5b694aceb365efae4781eec5",
        y: "0xb98bce418ffa0076d45cdfeac10070dc81cc9360b496e9aa1044dbca92d8493f",
      },
      [owner.address],
    );

    const walletBeacon = await hre.ethers.deployContract("UpgradeableBeacon", [
      await sdwallet.getAddress(),
      owner.address,
    ]);

    return {
      sdwallet,
      walletBeacon,
      owner,
      otherAccount,
    };
  }

  async function deployFactory() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();
    const { gatewayBeacon } = await loadFixture(deployOperatorGateway);
    const { walletBeacon } = await loadFixture(deployWallet);

    const factory = await hre.ethers.deployContract("SnickerdoodleFactory", []);
    await factory.initialize(
      owner.address, // this needs something to make it work
      owner.address,
      await walletBeacon.getAddress(),
      await gatewayBeacon.getAddress(),
    );

    return {
      factory,
      owner,
      otherAccount,
    };
  }

  describe("Deploy OperatorGateway", function () {
    it("Test adding and removing an eTLD+1 domain", async function () {
      const { gateway, owner } = await loadFixture(deployFactory);
    });
  });
});
