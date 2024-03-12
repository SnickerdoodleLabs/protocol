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
    await consentFactory
      .connect(otherAccount)
      .createConsent(otherAccount.address, "example.com");

    // read the event logs to find the contract address
    const events1 = await consentFactory.queryFilter(
      await consentFactory.filters.ConsentContractDeployed(owner.address),
    );
    const events2 = await consentFactory.queryFilter(
      await consentFactory.filters.ConsentContractDeployed(
        otherAccount.address,
      ),
    );
    console.log("events2: ", events2);

    // get a contract handle on the deployed contract
    const consentContract = await ethers.getContractAt(
      "Consent",
      events1[0].args[1],
    );

    const consentContract2 = await ethers.getContractAt(
      "Consent",
      events2[0].args[1],
    );

    return {
      consentFactory,
      consentContract,
      consentContract2,
      token,
      owner,
      otherAccount,
    };
  }

  describe("Stake a tag", function () {
    it("Try staking on a single deployed Content Object", async function () {
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

    it("Try staking on a single deployed Content Object with two staking accounts", async function () {
      const { consentFactory, consentContract, token, owner, otherAccount } =
        await loadFixture(deployConsentStack);

      // first compute the fee required for a desired slot
      const ownerSlot = 65000;
      const ownerFee = await consentContract.computeFee(ownerSlot);
      const otherSlot = 70000;
      const otherFee = await consentContract.computeFee(otherSlot);

      // give some token to the other account and also give it the STAKER_ROLE
      await expect(
        token.transfer(otherAccount.address, otherFee),
      ).to.changeTokenBalance(token, otherAccount, otherFee);
      const STAKER_ROLE = await consentContract.STAKER_ROLE();
      await consentContract.grantRole(STAKER_ROLE, otherAccount.address);
      expect(
        await consentContract.hasRole(STAKER_ROLE, otherAccount.address),
      ).to.equal(true);

      // first allow the consent contract a token budget of 1000 tokens
      await token.approve(await consentContract.getAddress(), ownerFee);
      await token
        .connect(otherAccount)
        .approve(await consentContract.getAddress(), otherFee);

      // then initialize a tag
      await consentContract.newGlobalTag(
        "NFT",
        await token.getAddress(),
        ownerSlot,
      );

      // see if the tag was registered correctly
      expect(
        await consentContract.getNumberOfStakedTags(await token.getAddress()),
      ).to.equal(1);

      // then initialize a tag
      await expect(
        consentContract
          .connect(otherAccount)
          .newGlobalTag("NFT", await token.getAddress(), otherSlot),
      ).to.be.revertedWith("Content Object: This tag is already staked.");

      await consentContract
        .connect(otherAccount)
        .newGlobalTag("Degen", await token.getAddress(), otherSlot);

      // see if the tag was registered correctly
      expect(
        await consentContract.getNumberOfStakedTags(await token.getAddress()),
      ).to.equal(2);

      // check that the fee is held by the consent contract
      expect(
        await token.balanceOf(await consentContract.getAddress()),
      ).to.equal(ownerFee + otherFee);
    });
  });
});
