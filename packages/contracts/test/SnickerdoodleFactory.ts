import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

import { getP256Keys } from "./helpers";

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

    const endpointV2Mock = await hre.ethers.deployContract(
      "EndpointV2Mock",
      [],
    );
    const factory = await hre.ethers.deployContract("SnickerdoodleFactory", []);
    await factory.initialize(
      await endpointV2Mock.getAddress(), // this needs something to make it work
      owner.address,
      await walletBeacon.getAddress(),
      await gatewayBeacon.getAddress(),
    );

    return {
      factory,
      gatewayBeacon,
      walletBeacon,
      owner,
      otherAccount,
    };
  }

  describe("Deploy OperatorGateway", function () {
    it("Test deploying an operator gateway", async function () {
      const { factory, gatewayBeacon, owner } = await loadFixture(
        deployFactory,
      );

      const domain = "snickerdoodle";
      const predictedAddress = await factory.computeProxyAddress(
        domain,
        await gatewayBeacon.getAddress(),
      );

      await expect(factory.deployOperatorGatewayProxy(domain, [owner.address]))
        .to.emit(factory, "OperatorGatewayDeployed")
        .withArgs(predictedAddress, domain);
    });

    it("Test deploying a user wallet", async function () {
      const { factory, gatewayBeacon, walletBeacon, owner } = await loadFixture(
        deployFactory,
      );

      const domain = "snickerdoodle";
      const username = "dummy";
      const name = `${username}.${domain}`;

      const tx = await factory.deployOperatorGatewayProxy(domain, [
        owner.address,
      ]);
      tx.wait();
      const operator = await hre.ethers.getContractAt(
        "OperatorGateway",
        await factory.computeProxyAddress(
          domain,
          await gatewayBeacon.getAddress(),
        ),
      );

      const [ownerP256] = getP256Keys();

      await expect(
        operator.deployWallets([username], [ownerP256], [[owner.address]]),
      )
        .to.emit(factory, "WalletCreated")
        .withArgs(
          await factory.computeProxyAddress(
            name,
            await walletBeacon.getAddress(),
          ),
          name,
        );
    });
  });
});
