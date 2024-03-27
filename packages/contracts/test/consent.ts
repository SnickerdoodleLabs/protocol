import { randomBytes } from "crypto";

import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

function generateRandomHex(length: number): string {
  const bytes = randomBytes(length);
  return bytes.toString("hex");
}

async function getSignature(owner, contract, nonce) {
  const msgHash: string = ethers.solidityPackedKeccak256(
    ["address", "uint256"],
    [contract, nonce],
  );

  // Sign the string message
  // This step represents a business user signing a message for an approved user on their platform
  const sig = await owner.signMessage(ethers.getBytes(msgHash));

  return sig;
}

describe("Consent Contract and Factory Tests", function () {
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

      // check that the governance token was set correctly
      const governanceToken = await consentFactory.getGovernanceToken();
      expect(governanceToken).to.equal(token.target);

      // check that the governance token is a staking token
      const isStakingToken = await consentFactory.isStakingToken(
        governanceToken,
      );
      expect(isStakingToken).to.equal(true);

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
    it("Unrestricted single optin", async function () {
      const { consentFactory, token, owner, otherAccount } = await loadFixture(
        deployConsentStack,
      );

      // add snickerdoodle.com to the token contract
      await expect(
        consentFactory.createConsent(owner.address, "snickerdoodle.com"),
      )
        .to.emit(consentFactory, "ConsentContractDeployed")
        .withArgs(owner.address, anyValue);

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
      const optInCommitment = `0x${generateRandomHex(32)}`;
      await consentContract.optIn(optInCommitment);
      expect(await consentContract.totalSupply()).to.equal(1);

      // a commitment cannot be written twice
      // make an arbitrary commitment of 32 bytes
      await expect(consentContract.optIn(optInCommitment)).to.be.revertedWith(
        "Commitment exists already",
      );

      // make second arbitrary commitment of 32 bytes, so see gas improvement after storage slot warming
      const optInCommitment2 = `0x${generateRandomHex(32)}`;
      await consentContract.optIn(optInCommitment2);
      expect(await consentContract.totalSupply()).to.equal(2);

      // check the indexes of the commitments are correct
      const indexes = await consentContract.checkCommitments([
        optInCommitment,
        optInCommitment2,
      ]);
      expect(indexes).to.eql([1n, 2n]);
    });

    it("Unrestricted batch optin", async function () {
      const { consentFactory, token, owner, otherAccount } = await loadFixture(
        deployConsentStack,
      );

      // add snickerdoodle.com to the token contract
      await expect(
        consentFactory.createConsent(owner.address, "snickerdoodle.com"),
      )
        .to.emit(consentFactory, "ConsentContractDeployed")
        .withArgs(owner.address, anyValue);

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

      const sizeBatch = 600;
      const commitmentBatch: string[] = [];
      for (let i = 0; i < sizeBatch; i++) {
        commitmentBatch.push(`0x${generateRandomHex(32)}`);
      }

      // make an arbitrary commitment of 32 bytes
      await consentContract.batchOptIn(commitmentBatch);
      expect(await consentContract.totalSupply()).to.equal(sizeBatch);
      const output = await consentContract.fetchAnonymitySet(0, sizeBatch);
      expect(await consentContract.fetchAnonymitySet(0, sizeBatch)).to.eql(
        commitmentBatch,
      );
    });

    it("Restricted single optin", async function () {
      const { consentFactory, token, owner, otherAccount } = await loadFixture(
        deployConsentStack,
      );

      // add snickerdoodle.com to the token contract
      await expect(
        consentFactory.createConsent(owner.address, "snickerdoodle.com"),
      )
        .to.emit(consentFactory, "ConsentContractDeployed")
        .withArgs(owner.address, anyValue);

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

      // owner address should have signer rol
      const SIGNER_ROLE = await consentContract.SIGNER_ROLE();
      expect(
        await consentContract.hasRole(SIGNER_ROLE, owner.address),
      ).to.equal(true);

      // disable open opt ins
      await consentContract.disableOpenOptIn();

      // opt optIns should fail now
      await expect(
        consentContract.optIn(`0x${generateRandomHex(32)}`),
      ).to.be.revertedWith("Consent: Open opt-ins are currently disabled");

      const nonce = "1";
      const commitment = `0x${generateRandomHex(32)}`;
      const optInSignature = await getSignature(
        owner,
        await consentContract.getAddress(),
        nonce,
      );
      await consentContract.restrictedOptIn(nonce, commitment, optInSignature);
      expect(await consentContract.totalSupply()).to.equal(1);
    });
  });
});
