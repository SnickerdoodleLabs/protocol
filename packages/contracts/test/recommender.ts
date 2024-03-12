import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Stake for Ranking tests", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployConsentStack() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    // deploy the consent contract
    const consent = await ethers.deployContract("Consent");
    await consent.waitForDeployment();

    // deploy the token contract
    const Token = await ethers.getContractFactory("Snickerdoodle");
    const token = await upgrades.deployProxy(Token);
    await token.waitForDeployment();

    // deploy the consent contract factory
    const ConsentFactory = await ethers.getContractFactory("ConsentFactory");
    const consentFactory = await upgrades.deployProxy(ConsentFactory, [
      consent.target,
      token.target,
    ]);
    await consentFactory.waitForDeployment();

    await consentFactory.createConsent(owner.address, "snickerdoodle.com");

    // read the event logs to find the contract address
    const filter = await consentFactory.filters.ConsentContractDeployed(
      owner.address,
    );
    const events = await consentFactory.queryFilter(filter);

    // get a contract handle on the deployed contract
    const consentContract = await ethers.getContractAt(
      "Consent",
      events[0].args[1],
    );

    return { consentFactory, consentContract, token, owner, otherAccount };
  }

  describe("Stake a tag", function () {
    it("Try staking on a single deployed Content Object and then removing it", async function () {
      const { consentFactory, consentContract, token, owner, otherAccount } =
        await loadFixture(deployConsentStack);

      // first compute the fee required for a desired slot
      const mySlot = 65000;
      const fee = await consentContract.computeFee(mySlot);

      // first allow the consent contract a token budget of 1000 tokens
      await token.approve(await consentContract.getAddress(), fee);

      // then initialize a tag
      await consentContract.newGlobalTag(
        "NFT",
        await token.getAddress(),
        mySlot,
      );

      // see if the tag was registered correctly
      expect(
        await consentContract.getNumberOfStakedTags(await token.getAddress()),
      ).to.equal(1);

      // check that the fee is held by the consent contract
      expect(
        await token.balanceOf(await consentContract.getAddress()),
      ).to.equal(fee);

      // now destake the listing
      await consentContract.removeListing("NFT", await token.getAddress());
      expect(
        await token.balanceOf(await consentContract.getAddress()),
      ).to.equal(0);

      // should be no staked tags now
      expect(
        await consentContract.getNumberOfStakedTags(await token.getAddress()),
      ).to.equal(0);
    });
  });
});
