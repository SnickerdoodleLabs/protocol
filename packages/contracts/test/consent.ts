import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Storage Hashing", function () {
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

    return { consentFactory, token, owner, otherAccount };
  }

  describe("Consent Factory Basic Constants", function () {
    it("Check for correct token supply and correct staking token", async function () {
      const { token } = await loadFixture(deployConsentStack);
      const totalSupply = await token.totalSupply();
      expect(totalSupply).to.equal(ethers.parseUnits("13500000000"));
    });

    it("Check for correct factory constants", async function () {
      const { consentFactory, token } = await loadFixture(deployConsentStack);

      // check that the staking token was set correctly
      const stakingToken = await consentFactory.getStakingToken();
      expect(stakingToken).to.equal(token.target);

      // check the listing duration is 2 weeks
      const listingDuration = await consentFactory.listingDuration();
      expect(listingDuration).to.equal(BigInt(60 * 60 * 24 * 14));

      // check for the correct maximum number of tags
      const maxTags = await consentFactory.maxTagsPerListing();
      expect(maxTags).to.equal(20);
    });
  });

  describe("Check ERC7529 Functions", function () {
    it("Token contract", async function () {
      const { token, owner, otherAccount } = await loadFixture(
        deployConsentStack,
      );

      // add snickerdoodle.com to the token contract
      await token.addDomain("snickerdoodle.com");
      expect(await token.getDomain("snickerdoodle.com")).to.equal(true);
      expect(await token.getDomain("example.com")).to.equal(false);
    });

    it("Check for correct factory constants", async function () {
      const { consentFactory } = await loadFixture(deployConsentStack);

      // add snickerdoodle.com to the factory contract
      await consentFactory.addDomain("snickerdoodle.com");
      expect(await consentFactory.getDomain("snickerdoodle.com")).to.equal(
        true,
      );
      expect(await consentFactory.getDomain("example.com")).to.equal(false);
    });
  });

  describe("Opt In function", function () {
    it("Unrestricted optin", async function () {
      const { consentFactory, token, owner, otherAccount } = await loadFixture(
        deployConsentStack,
      );

      // add snickerdoodle.com to the token contract
      await expect(
        consentFactory.createConsent(owner.address, "snickerdoodle.com"),
      )
        .to.emit(consentFactory, "ConsentContractDeployed")
        .withArgs(owner.address, anyValue, token.target);

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

      // make an arbitrary commitment of 32 bytes
      await consentContract.optIn(
        "0xe5a9ca207f58274b38dd4efcf7998077f154da4dff4c6f2ae387b8066bd7c31b",
      );
      expect(await consentContract.totalSupply()).to.equal(1);

      // a commitment cannot be written twice
      // make an arbitrary commitment of 32 bytes
      await expect(
        consentContract.optIn(
          "0xe5a9ca207f58274b38dd4efcf7998077f154da4dff4c6f2ae387b8066bd7c31b",
        ),
      ).to.be.revertedWith("Commitment exists already");

      // make second arbitrary commitment of 32 bytes, so see gas improvement after storage slot warming
      await consentContract.optIn(
        "0xe6a9ca207f58274b38dd4efcf7998077f154da4dff4c6f2ae387b8066bd7c31b",
      );
      expect(await consentContract.totalSupply()).to.equal(2);
    });
  });
});
