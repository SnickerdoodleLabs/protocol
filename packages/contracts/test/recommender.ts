import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import {
  mine,
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

    // get a contract handle on the deployed contract
    const consentContract = await ethers.getContractAt(
      "Consent",
      events1[0].args[1],
    );

    const consentContract2 = await ethers.getContractAt(
      "Consent",
      events2[0].args[1],
      otherAccount,
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

  describe("Staking mechanics", function () {
    it("Only STAKER_ROLE can stake for content objects", async function () {
      const { consentFactory, token, owner } = await loadFixture(
        deployConsentStack,
      );

      // then initialize a tag
      await expect(
        consentFactory.initializeTag("NFT", await token.getAddress(), 10),
      ).to.be.revertedWith("ConsentFactory: Caller is not a Consent Contract");
    });

    it("Only registered content objects can list in global factory listings", async function () {
      const { consentFactory, consentContract, token, owner, otherAccount } =
        await loadFixture(deployConsentStack);

      // first compute the fee required for a desired slot
      const mySlot = 65000;
      const fee = await consentContract.computeFee(mySlot);

      // first allow the consent contract a token budget of 1000 tokens
      await token.approve(await consentContract.getAddress(), fee);

      // then initialize a tag
      await expect(
        consentContract
          .connect(otherAccount)
          .newGlobalTag("NFT", await token.getAddress(), mySlot),
      )
        .to.be.revertedWithCustomError(
          consentContract,
          "AccessControlUnauthorizedAccount",
        )
        .withArgs("0x70997970C51812dc3A010C7d01b50e0d17dc79C8", anyValue);
    });

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

    it("Try inserting a listing upstream of existing listing", async function () {
      const {
        consentFactory,
        consentContract,
        consentContract2,
        token,
        owner,
        otherAccount,
      } = await loadFixture(deployConsentStack);

      // first compute the fee required for a desired slot
      const ownerSlot = 65000;
      const ownerFee = await consentContract.computeFee(ownerSlot);
      const otherSlot = 70000;
      const otherFee = await consentContract.computeFee(otherSlot);

      // give some token to the other account
      await expect(
        token.transfer(otherAccount.address, otherFee),
      ).to.changeTokenBalance(token, otherAccount, otherFee);

      // first allow the consent contract a token budget of 1000 tokens
      await token.approve(await consentContract.getAddress(), ownerFee);
      await token
        .connect(otherAccount)
        .approve(await consentContract2.getAddress(), otherFee);

      // then initialize a tag in the first consent contract
      await consentContract.newGlobalTag(
        "NFT",
        await token.getAddress(),
        ownerSlot,
      );

      // then initialize a tag in the other consent contract upstream of existing slot
      await consentContract2.newLocalTagUpstream(
        "NFT",
        await token.getAddress(),
        otherSlot,
        ownerSlot,
      );

      // see if the tag was registered correctly
      expect(
        await consentContract2.getNumberOfStakedTags(await token.getAddress()),
      ).to.equal(1);
    });

    it("Try inserting a listing downstream of existing listing", async function () {
      const {
        consentFactory,
        consentContract,
        consentContract2,
        token,
        owner,
        otherAccount,
      } = await loadFixture(deployConsentStack);

      // first compute the fee required for a desired slot
      const ownerSlot = 70000;
      const ownerFee = await consentContract.computeFee(ownerSlot);
      const otherSlot = 65000;
      const otherFee = await consentContract.computeFee(otherSlot);

      // give some token to the other account
      await expect(
        token.transfer(otherAccount.address, otherFee),
      ).to.changeTokenBalance(token, otherAccount, otherFee);

      // first allow the consent contract a token budget of 1000 tokens
      await token.approve(await consentContract.getAddress(), ownerFee);
      await token
        .connect(otherAccount)
        .approve(await consentContract2.getAddress(), otherFee);

      // then initialize a tag in the first consent contract
      await consentContract.newGlobalTag(
        "NFT",
        await token.getAddress(),
        ownerSlot,
      );

      // then initialize a tag in the other consent contract upstream of existing slot
      await consentContract2.newLocalTagDownstream(
        "NFT",
        await token.getAddress(),
        ownerSlot,
        otherSlot,
      );

      // see if the tag was registered correctly
      expect(
        await consentContract2.getNumberOfStakedTags(await token.getAddress()),
      ).to.equal(1);
    });

    it("Test restaking of an expired listing", async function () {
      const { consentFactory, consentContract, token, owner, otherAccount } =
        await loadFixture(deployConsentStack);

      // first compute the fee required for a desired slot
      const ownerSlot = 70000;
      const ownerFee = await consentContract.computeFee(ownerSlot);

      // first allow the consent contract a token budget of 1000 tokens
      await token.approve(await consentContract.getAddress(), ownerFee);

      // then initialize a tag in the first consent contract
      await consentContract.newGlobalTag(
        "NFT",
        await token.getAddress(),
        ownerSlot,
      );

      // it should show up in getListingsForward and getListingsBackward
      const listingsForward = await consentFactory.getListingsForward(
        "NFT",
        await token.getAddress(),
        ownerSlot,
        1,
        true,
      );

      // should be the baseURI of the content object
      expect(listingsForward[0][0]).to.equal("snickerdoodle.com");

      // should be equal to the address of the content object
      expect(listingsForward[1][0][2]).to.equal(
        await consentContract.getAddress(),
      );

      // now fast forward 2 weeks (60 * 60 * 24 * 12) plus 1 second
      await mine(80641, { interval: 15 });

      // at this point, getListingsForward and getListingsBackward should ignore the expired listing
      const expiredListingsForward = await consentFactory.getListingsForward(
        "NFT",
        await token.getAddress(),
        ownerSlot,
        1,
        true,
      );

      // should be empty element because the listing is expired
      expect(expiredListingsForward[0][0]).to.equal("");

      // now restake the listing
      await consentContract.restakeExpiredListing(
        "NFT",
        await token.getAddress(),
      );

      // and it should now show back up in the global listings
      // it should show up in getListingsForward and getListingsBackward
      const restakedListingsForward = await consentFactory.getListingsForward(
        "NFT",
        await token.getAddress(),
        ownerSlot,
        1,
        true,
      );

      // should be the baseURI of the content object
      expect(restakedListingsForward[0][0]).to.equal("snickerdoodle.com");
      expect(listingsForward[1][0][2]).to.equal(
        await consentContract.getAddress(),
      );
    });

    it("Test replacing an expired listing with a new one", async function () {
      const {
        consentFactory,
        consentContract,
        consentContract2,
        token,
        owner,
        otherAccount,
      } = await loadFixture(deployConsentStack);

      // first compute the fee required for a desired slot
      const slot = 70000;
      const fee = await consentContract.computeFee(slot);

      // give some token to the other account
      await expect(
        token.transfer(otherAccount.address, fee),
      ).to.changeTokenBalance(token, otherAccount, fee);

      // first allow the consent contract a token budget of 1000 tokens
      await token.approve(await consentContract.getAddress(), fee);
      await token
        .connect(otherAccount)
        .approve(await consentContract2.getAddress(), fee);

      // then initialize a tag in the first consent contract
      await consentContract.newGlobalTag("NFT", await token.getAddress(), slot);

      // the listing cannot be replaced while its active
      await expect(
        consentContract2.replaceExpiredListing(
          "NFT",
          await token.getAddress(),
          slot,
        ),
      ).to.be.revertedWith("ConsentFactory: current listing is still active");

      // now fast forward 2 weeks (60 * 60 * 24 * 12) plus 1 second
      await mine(80641, { interval: 15 });

      // now that the listing is expired, replace it with another content objects listing
      await consentContract2.replaceExpiredListing(
        "NFT",
        await token.getAddress(),
        slot,
      );

      // the new listing should show up now in the global listing
      const listings = await consentFactory.getListingsForward(
        "NFT",
        await token.getAddress(),
        slot,
        1,
        true,
      );

      // should be the baseURI of the content object
      expect(listings[0][0]).to.equal("example.com");
    });

    it("Try upping the stake on an existing listing", async function () {
      const { consentFactory, consentContract, token, owner, otherAccount } =
        await loadFixture(deployConsentStack);

      // first compute the fee required for a desired slot
      const initialSlot = 40000;
      const finalSlot = 60000;
      const deltaSlot = finalSlot - initialSlot;
      const initialFee = await consentContract.computeFee(initialSlot);
      const finalFee = await consentContract.computeFee(finalSlot);
      const deltaFee =
        (await consentContract.computeFee(finalSlot)) -
        (await consentContract.computeFee(initialSlot));

      // first allow the consent contract a token budget of initialFee
      await token.approve(await consentContract.getAddress(), initialFee);

      // then initialize a tag
      await consentContract.newGlobalTag(
        "NFT",
        await token.getAddress(),
        initialSlot,
      );

      // check that the fee is held by the consent contract
      expect(
        await token.balanceOf(await consentContract.getAddress()),
      ).to.equal(initialFee);

      // now allow the consent contract a token budget of deltaFee
      await token.approve(await consentContract.getAddress(), deltaFee);

      // then move the listing up the chart
      await consentContract.moveExistingListingUpstream(
        "NFT",
        await token.getAddress(),
        finalSlot,
        0,
      );

      // check that the fee is held by the consent contract
      expect(
        await token.balanceOf(await consentContract.getAddress()),
      ).to.equal(finalFee);
    });
  });
});
