const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

const agreementFlags1 = ethers.utils.formatBytes32String(1);
const agreementFlags2 = ethers.utils.formatBytes32String(2);
const agreementFlags3 = ethers.utils.formatBytes32String(3);

async function getAddress(contract) {
  const txHash = contract.deployTransaction.hash;
  const txReceipt = await ethers.provider.waitForTransaction(txHash);
  return txReceipt.contractAddress;
}

describe("ConsentFactory", () => {
  // declare variables to be used in tests
  let Consent;
  let consentAddress;
  let ConsentFactory;
  let consentFactory;
  let deployedConsentAddress;

  let accounts;
  let owner;
  let user1;
  let user2;
  let trustedForwarder;

  const pauserRoleBytes = ethers.utils.id("PAUSER_ROLE");
  const signerRoleBytes = ethers.utils.id("SIGNER_ROLE");
  const requesterRoleBytes = ethers.utils.id("REQUESTER_ROLE");
  const defaultAdminRoleBytes = ethers.utils.formatBytes32String(0); //bytes for DEFAULT_ADMIN_ROLE on the contract is 0 by default

  beforeEach(async () => {
    accounts = await hre.ethers.getSigners();
    owner = accounts[0];
    user1 = accounts[1];
    user2 = accounts[2];
    trustedForwarder = accounts[19];

    // deploy the Consent contract before each test
    Consent = await ethers.getContractFactory("Consent");
    consent = await Consent.deploy();
    const deployedConsent = await consent.deployed();
    const consentImpAddress = deployedConsent.address;

    // deploy the Consent factory contract before each test
    // the Consent factory also deploys the UpgradeableBeacon contract
    ConsentFactory = await ethers.getContractFactory("ConsentFactory");
    consentFactory = await upgrades.deployProxy(ConsentFactory, [
      trustedForwarder.address,
      consentImpAddress,
    ]);
    await consentFactory.deployed();
  });

  describe("Stake-for-Ranking", function () {
    it("Test basic Marketplace insertion and deletion", async function () {
      // SCENARIO: User 1 initializes slot 3 => User 2 inserts upstream slot 4 => User 1 removes listing (which removes their slot 3) => User 1 inserts downstream of User 2 on slot 2
      // => User 1 moves from slot 2 to slot 10

      // create a couple of consent contracts
      await consentFactory
        .connect(owner)
        .createConsent(user1.address, "Listing1", "Brand1")
        .then((tx) => {
          return tx.wait();
        });

      await consentFactory
        .connect(owner)
        .createConsent(user2.address, "Listing2", "Brand2")
        .then((tx) => {
          return tx.wait();
        });

      // get the deployed address by looking up the provided name
      deployedConsentAddressArray1 =
        await consentFactory.getUserDeployedConsentsByIndex(
          user1.address,
          0,
          1,
        );

      deployedConsentAddressArray2 =
        await consentFactory.getUserDeployedConsentsByIndex(
          user2.address,
          0,
          1,
        );

      // attach the deployed Consent address and check it's uri
      const deployedConsentInstance1 = consent.attach(
        deployedConsentAddressArray1[0],
      );
      const deployedConsentInstance2 = consent.attach(
        deployedConsentAddressArray2[0],
      );

      const slot2 = 2;
      const slot3 = 3;
      const slot4 = 4;
      const slot10= 10; 

      const tag2 = "short-string-2";
      const tag3 = "short-string-3";

      await deployedConsentInstance1
        .connect(user1)
        .newGlobalTag(tag2, slot3)
        .then((txrct) => {
          return txrct.wait();
        });

      // initialize a new tag globally from user 1
      await expect(
        deployedConsentInstance1.connect(user1).newGlobalTag(tag2, slot3),
      ).to.revertedWith(
        "Consent Contract: This tag is already staked by this contract",
      );

      // user 2 inserts a listing upstream of user 1's listing on the same tag
      await deployedConsentInstance2
        .connect(user2)
        .newLocalTagUpstream(tag2, slot4, slot3)
        .then((txrct) => {
          return txrct.wait();
        });

      await expect(
        deployedConsentInstance2
          .connect(user2)
          .newLocalTagUpstream(tag2, slot3, slot2),
      ).to.revertedWith(
        "Consent Contract: This tag is already staked by this contract",
      );

      // user 1 removes its previously staked tag
      await deployedConsentInstance1
        .connect(user1)
        .removeListing(tag2)
        .then((txrct) => {
          return txrct.wait();
        });

      expect(await consentFactory.getTagTotal(tag2)).to.eq(1);

      // user 1 inserts another listing downstream of user 2
      await deployedConsentInstance1
        .connect(user1)
        .newLocalTagDownstream(tag2, slot4, slot2)
        .then((txrct) => {
          return txrct.wait();
        });

      expect(await consentFactory.getTagTotal(tag2)).to.eq(2);

      const forwardList = await consentFactory.getListingsForward(
        tag2,
        4,
        2,
        true,
      );

      await expect(forwardList[0][0]).to.eq("Listing2");
      await expect(forwardList[0][1]).to.eq("Listing1");
      await expect(forwardList[1][0].next).to.eq(slot2);
      await expect(forwardList[1][1].previous).to.eq(slot4);

      const backwardList = await consentFactory.getListingsBackward(
        tag2,
        2,
        2,
        true,
      );

      await expect(backwardList[0][0]).to.eq("Listing1");
      await expect(backwardList[0][1]).to.eq("Listing2");
      await expect(backwardList[1][0].previous).to.eq(slot4);
      await expect(backwardList[1][1].next).to.eq(slot2);

      // user 1 moves their listing upstream of user 2
      await deployedConsentInstance1
        .connect(user1)
        .moveExistingListingUpstream(tag2, slot10, slot4)
        .then((txrct) => {
          return txrct.wait();
      });

      const forwardList2 = await consentFactory.getListingsForward(
        tag2,
        10,
        2,
        true,
      );

      // check that the new ordering makes sense
      await expect(forwardList2[0][0]).to.eq("Listing1");
      await expect(forwardList2[0][1]).to.eq("Listing2");
      await expect(forwardList2[1][0].next).to.eq(slot4);
      await expect(forwardList2[1][1].previous).to.eq(slot10);
    });

    it("Insert upstream and test listing getters", async function () {
      // SCENARIO: User 1 initializes slot 3 => User 2 inserts upstream slot 4

      // create a couple of consent contracts
      await consentFactory
        .connect(owner)
        .createConsent(user1.address, "Listing1", "Brand1")
        .then((tx) => {
          return tx.wait();
        });

      await consentFactory
        .connect(owner)
        .createConsent(user2.address, "Listing2", "Brand2")
        .then((tx) => {
          return tx.wait();
        });

      // get the deployed address by looking up the provided name
      deployedConsentAddressArray1 =
        await consentFactory.getUserDeployedConsentsByIndex(
          user1.address,
          0,
          1,
        );

      deployedConsentAddressArray2 =
        await consentFactory.getUserDeployedConsentsByIndex(
          user2.address,
          0,
          1,
        );

      // attach the deployed Consent address and check it's uri
      const deployedConsentInstance1 = consent.attach(
        deployedConsentAddressArray1[0],
      );
      const deployedConsentInstance2 = consent.attach(
        deployedConsentAddressArray2[0],
      );

      const slot2 = 2;
      const slot3 = 3;
      const slot4 = 4;

      const tag2 = "short-string-2";
      const tag3 = "short-string-3";

      await deployedConsentInstance1
        .connect(user1)
        .newGlobalTag(tag2, slot3)
        .then((txrct) => {
          return txrct.wait();
        });

      // initialize a new tag globally from user 1
      await expect(
        deployedConsentInstance1.connect(user1).newGlobalTag(tag2, slot3),
      ).to.revertedWith(
        "Consent Contract: This tag is already staked by this contract",
      );

      // user 2 inserts a listing upstream of user 1's listing on the same tag
      await deployedConsentInstance2
        .connect(user2)
        .newLocalTagUpstream(tag2, slot4, slot3)
        .then((txrct) => {
          return txrct.wait();
        });

      await expect(
        deployedConsentInstance2
          .connect(user2)
          .newLocalTagUpstream(tag2, slot3, slot2),
      ).to.revertedWith(
        "Consent Contract: This tag is already staked by this contract",
      );

      expect(await consentFactory.getTagTotal(tag2)).to.eq(2);

      const forwardList = await consentFactory.getListingsForward(
        tag2,
        4,
        4,
        true,
      );

      await expect(forwardList[0][0]).to.eq("Listing2");
      await expect(forwardList[0][1]).to.eq("Listing1");
      await expect(forwardList[1][0].next).to.eq(slot3);
      await expect(forwardList[1][1].previous).to.eq(slot4);

      const backwardList = await consentFactory.getListingsBackward(
        tag2,
        3,
        2,
        true,
      );

      await expect(backwardList[0][0]).to.eq("Listing1");
      await expect(backwardList[0][1]).to.eq("Listing2");
      await expect(backwardList[1][0].previous).to.eq(slot4);
      await expect(backwardList[1][1].next).to.eq(slot3);
    });

    it("Insert downstream and test listing getters", async function () {
      // SCENARIO: User 1 initializes slot 3 => User 2 inserts upstream slot 2

      // create a couple of consent contracts
      await consentFactory
        .connect(owner)
        .createConsent(user1.address, "Listing1", "Brand1")
        .then((tx) => {
          return tx.wait();
        });

      await consentFactory
        .connect(owner)
        .createConsent(user2.address, "Listing2", "Brand2")
        .then((tx) => {
          return tx.wait();
        });

      // get the deployed address by looking up the provided name
      deployedConsentAddressArray1 =
        await consentFactory.getUserDeployedConsentsByIndex(
          user1.address,
          0,
          1,
        );

      deployedConsentAddressArray2 =
        await consentFactory.getUserDeployedConsentsByIndex(
          user2.address,
          0,
          1,
        );

      // attach the deployed Consent address and check it's uri
      const deployedConsentInstance1 = consent.attach(
        deployedConsentAddressArray1[0],
      );
      const deployedConsentInstance2 = consent.attach(
        deployedConsentAddressArray2[0],
      );

      const slot2 = 2;
      const slot3 = 3;
      const slot4 = 4;

      const tag2 = "short-string-2";
      const tag3 = "short-string-3";

      await deployedConsentInstance1
        .connect(user1)
        .newGlobalTag(tag2, slot3)
        .then((txrct) => {
          return txrct.wait();
        });

      // initialize a new tag globally from user 1
      await expect(
        deployedConsentInstance1.connect(user1).newGlobalTag(tag2, slot3),
      ).to.revertedWith(
        "Consent Contract: This tag is already staked by this contract",
      );

      // user 2 inserts a listing downstream of user 1's listing on the same tag
      await deployedConsentInstance2
        .connect(user2)
        .newLocalTagDownstream(tag2, slot3, slot2)
        .then((txrct) => {
          return txrct.wait();
        });

      await expect(
        deployedConsentInstance2
          .connect(user2)
          .newLocalTagUpstream(tag2, slot3, slot2),
      ).to.revertedWith(
        "Consent Contract: This tag is already staked by this contract",
      );

      expect(await consentFactory.getTagTotal(tag2)).to.eq(2);

      const forwardList = await consentFactory.getListingsForward(
        tag2,
        3,
        2,
        true,
      );

      await expect(forwardList[0][0]).to.eq("Listing1");
      await expect(forwardList[0][1]).to.eq("Listing2");
      await expect(forwardList[1][0].next).to.eq(slot2);
      await expect(forwardList[1][1].previous).to.eq(slot3);

      const backwardList = await consentFactory.getListingsBackward(
        tag2,
        2,
        2,
        true,
      );

      await expect(backwardList[0][0]).to.eq("Listing2");
      await expect(backwardList[0][1]).to.eq("Listing1");
      await expect(backwardList[1][0].previous).to.eq(slot3);
      await expect(backwardList[1][1].next).to.eq(slot2);
    });

    it("Test Marketplace expiration mechanics", async function () {
      // create a couple of consent contracts
      await consentFactory
        .connect(owner)
        .createConsent(user1.address, "Listing1", "Brand1")
        .then((tx) => {
          return tx.wait();
        });

      // add a tail listing behind the head
      await consentFactory
        .connect(owner)
        .createConsent(user2.address, "Listing2", "Brand2")
        .then((tx) => {
          return tx.wait();
        });

      // get the deployed address by looking up the provided name
      deployedConsentAddressArray1 =
        await consentFactory.getUserDeployedConsentsByIndex(
          user1.address,
          0,
          1,
        );

      deployedConsentAddressArray2 =
        await consentFactory.getUserDeployedConsentsByIndex(
          user2.address,
          0,
          1,
        );

      // attach the deployed Consent address and check it's uri
      const deployedConsentInstance1 = consent.attach(
        deployedConsentAddressArray1[0],
      );
      const deployedConsentInstance2 = consent.attach(
        deployedConsentAddressArray2[0],
      );

      const slot2 = 2;
      const slot3 = 3;
      const slot4 = 4;

      const tag2 = "short-string-2";
      const tag3 = "short-string-3";

      // user 1 initializes a new tag globally
      await deployedConsentInstance1
        .connect(user1)
        .newGlobalTag(tag2, slot3)
        .then((txrct) => {
          return txrct.wait();
        });

      await expect(
        deployedConsentInstance2
          .connect(user2)
          .replaceExpiredListing(tag2, slot3),
      ).to.revertedWith("ConsentFactory: current listing is still active");

      // fast forward until the listing expires
      const listingDuration = await consentFactory.listingDuration();
      await ethers.provider.send("evm_increaseTime", [
        listingDuration.toNumber(),
      ]);
      await ethers.provider.send("evm_mine");

      // user 2 can now replace the expired listing
      await deployedConsentInstance2
        .connect(user2)
        .replaceExpiredListing(tag2, slot3)
        .then((txrct) => {
          return txrct.wait();
        });

      // user 1 can reclaim the stake from their expired listing
      await deployedConsentInstance1
        .connect(user1)
        .removeListing(tag2)
        .then((txrct) => {
          return txrct.wait();
        });

      expect(await consentFactory.getTagTotal(tag2)).to.eq(1);

      // restaking won't work if you are still active
      await expect(
        deployedConsentInstance2
        .connect(user2)
        .restakeExpiredListing(tag2),
      ).to.revertedWith("ConsentFactory: current listing is still active");

      // fastforward and restake expired listing
      await ethers.provider.send("evm_increaseTime", [
        listingDuration.toNumber(),
      ]);
      await ethers.provider.send("evm_mine");

      await deployedConsentInstance2
        .connect(user2)
        .restakeExpiredListing(tag2)
        .then((txrct) => {
          return txrct.wait();
      });
    });

    it("Test admin can remove listings", async function () {
      await consentFactory
        .connect(owner)
        .createConsent(user1.address, "Listing1", "Brand1")
        .then((tx) => {
          return tx.wait();
        });

      // get the deployed address by looking up the provided name
      deployedConsentAddressArray1 =
        await consentFactory.getUserDeployedConsentsByIndex(
          user1.address,
          0,
          1,
        );

      // attach the deployed Consent address and check it's uri
      const deployedConsentInstance1 = consent.attach(
        deployedConsentAddressArray1[0],
      );

      const slot2 = 2;
      const slot3 = 3;
      const slot4 = 4;

      const tag2 = "short-string-2";
      const tag3 = "short-string-3";

      // user 1 creates a new listing
      await deployedConsentInstance1
        .connect(user1)
        .newGlobalTag(tag2, slot3)
        .then((txrct) => {
          return txrct.wait();
        });

      // consent factory admin can unilaterally remove the listing from the marketplace
      await consentFactory
        .connect(owner)
        .adminRemoveListing(tag2, slot3)
        .then((txrct) => {
          return txrct.wait();
        });

      // admin has removed the listing but the consent contract still has the tag staked
      expect(
        await deployedConsentInstance1.connect(user1).getNumberOfStakedTags(),
      ).to.eq(1);

      // user 1 can reclaim their stake after admin cleared their listing
      await deployedConsentInstance1
        .connect(user1)
        .removeListing(tag2)
        .then((txrct) => {
          return txrct.wait();
        });

      expect(
        await deployedConsentInstance1.connect(user1).getNumberOfStakedTags(),
      ).to.eq(0);

      expect(await consentFactory.getTagTotal(tag2)).to.eq(0);
    });
  });

  describe("createConsent", function () {
    it("Deploys a Beacon Proxy pointing to a new instance of a Consent contract", async function () {
      // create a consent contract
      const tx = await consentFactory
        .connect(owner)
        .createConsent(user1.address, "www.user1uri.com", "USER1");
      // get the receipt
      const receipt = await tx.wait();

      // get the hash of the event
      const event = "ConsentDeployed(address,address)";
      const eventHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(event));

      // filter out for ConsentDeployed event from the receipt logs
      const consentDeployedLog = receipt.logs.filter(
        (_log) => _log.topics[0] == eventHash,
      );
      // capture the data and topics
      const data = consentDeployedLog[0].data;
      const topics = consentDeployedLog[0].topics;

      // declare interface
      const Interface = ethers.utils.Interface;
      const iface = new Interface([
        "event ConsentDeployed(address indexed owner, address indexed consentAddress)",
      ]);

      // use interface to decode the logs with the data and topics
      const decoded = iface.decodeEventLog("ConsentDeployed", data, topics);

      // retrieve the address from the contract
      deployedConsentAddressArray =
        await consentFactory.getUserDeployedConsentsByIndex(
          user1.address,
          0,
          5,
        );

      // compare with address in the event log to ensure similar value
      expect(deployedConsentAddressArray[0]).to.eq(decoded.consentAddress);

      deployedConsentInstance = await Consent.attach(
        deployedConsentAddressArray[0],
      );

      // check the base uri
      expect(await deployedConsentInstance.connect(owner).baseURI()).to.eq(
        "www.user1uri.com",
      );

      // check if owner of the consent contract has appropriate roles
      expect(
        await deployedConsentInstance.hasRole(
          defaultAdminRoleBytes,
          user1.address,
        ),
      ).to.eq(true);
      expect(
        await deployedConsentInstance.hasRole(signerRoleBytes, user1.address),
      ).to.eq(true);
      expect(
        await deployedConsentInstance.hasRole(pauserRoleBytes, user1.address),
      ).to.eq(true);
    });

    it("Deploys two Beacon Proxy pointing to a new instance of a Consent contract", async function () {
      await consentFactory
        .connect(owner)
        .createConsent(user2.address, "www.user2uri.com", "USER2");
      await consentFactory
        .connect(owner)
        .createConsent(user2.address, "www.user2uri2.com", "USER22");

      // check the deployed count
      const deployedCount = await consentFactory.getUserDeployedConsentsCount(
        user2.address,
      );
      expect(deployedCount).to.eq(2);

      // get the deployed address by looking up the provided name
      deployedConsentAddressArray =
        await consentFactory.getUserDeployedConsentsByIndex(
          user2.address,
          0,
          5,
        );

      // attach the deployed Consent address and check it's uri
      const deployedConsentInstance1 = consent.attach(
        deployedConsentAddressArray[0],
      );
      const deployedConsentInstance2 = consent.attach(
        deployedConsentAddressArray[1],
      );

      expect(await deployedConsentInstance1.connect(owner).baseURI()).to.eq(
        "www.user2uri.com",
      );
      expect(await deployedConsentInstance2.connect(owner).baseURI()).to.eq(
        "www.user2uri2.com",
      );
    });

    it("Deploys a Beacon Proxy pointing to a new instance of a Consent contract with trusted forwarder address", async function () {
      await consentFactory
        .connect(trustedForwarder)
        .createConsent(user1.address, "www.user1uri.com", "USER1");

      // get the deployed address by looking up the provided name
      deployedConsentAddressArray =
        await consentFactory.getUserDeployedConsentsByIndex(
          user1.address,
          0,
          5,
        );

      // attach the deployed Consent address and check it's uri
      const deployedConsentInstance = consent.attach(
        deployedConsentAddressArray[0],
      );

      // check the base uri
      expect(await deployedConsentInstance.connect(owner).baseURI()).to.eq(
        "www.user1uri.com",
      );
    });

    it("Adds to the user's deployed Consent contracts array when a contract is created and adds its index correctly", async function () {
      // create two consent contracts
      await consentFactory
        .connect(owner)
        .createConsent(user2.address, "www.user2uri.com", "USER2");

      await consentFactory
        .connect(owner)
        .createConsent(user2.address, "www.user2uri2.com", "USER22");

      // get the deployed address by looking up the provided name
      deployedConsentAddressArray =
        await consentFactory.getUserDeployedConsentsByIndex(
          user2.address,
          0,
          5,
        );

      expect(deployedConsentAddressArray.length).to.eq(2);

      const firstIndex = await consentFactory.addressToDeployedConsentsIndex(
        user2.address,
        deployedConsentAddressArray[0],
      );

      const secondIndex = await consentFactory.addressToDeployedConsentsIndex(
        user2.address,
        deployedConsentAddressArray[1],
      );

      expect(firstIndex).to.eq(0);
      expect(secondIndex).to.eq(1);
    });
  });

  describe("addUserRole", function () {
    it("Does not allow address that was not deployed by the ConsentFactory to add user roles", async function () {
      // create a consent contract
      await expect(
        consentFactory
          .connect(owner)
          .addUserRole(user1.address, signerRoleBytes),
      ).to.revertedWith("ConsentFactory: Caller is not a Consent Contract");
    });

    it("Allows owner of Consent contract grants role and gets mapping and index updated", async function () {
      // create 2 consent contracts
      await consentFactory
        .connect(owner)
        .createConsent(user2.address, "www.user2uri.com", "USER2");

      await consentFactory
        .connect(owner)
        .createConsent(user2.address, "www.user2uri2.com", "USER22");

      // get the deployed address by looking up the provided name
      deployedConsentAddressArray =
        await consentFactory.getUserDeployedConsentsByIndex(
          user2.address,
          0,
          5,
        );

      const consent1 = await Consent.attach(deployedConsentAddressArray[0]);
      const consent2 = await Consent.attach(deployedConsentAddressArray[1]);

      // grant user 3 REQUESTER_ROLE in both consent contracts
      await consent1
        .connect(user2)
        .grantRole(requesterRoleBytes, accounts[3].address);
      await consent2
        .connect(user2)
        .grantRole(requesterRoleBytes, accounts[3].address);

      const userArrayCount = await consentFactory.getUserRoleAddressesCount(
        accounts[3].address,
        requesterRoleBytes,
      );
      expect(userArrayCount).to.eq(2);

      const userArray = await consentFactory.getUserRoleAddressesCountByIndex(
        accounts[3].address,
        requesterRoleBytes,
        0,
        5,
      );
      expect(userArray.length).to.eq(2);

      const firstIndex = await consentFactory.addressToUserRolesArrayIndex(
        accounts[3].address,
        requesterRoleBytes,
        deployedConsentAddressArray[0],
      );
      const secondIndex = await consentFactory.addressToUserRolesArrayIndex(
        accounts[3].address,
        requesterRoleBytes,
        deployedConsentAddressArray[1],
      );

      expect(firstIndex).to.eq(0);
      expect(secondIndex).to.eq(1);
    });
  });

  describe("removeUserRole", function () {
    it("Does not allow address that was not deployed by the ConsentFactory to remove user roles", async function () {
      // create a consent contract
      await expect(
        consentFactory
          .connect(owner)
          .removeUserRole(user1.address, signerRoleBytes),
      ).to.revertedWith("ConsentFactory: Caller is not a Consent Contract");
    });

    it("Allows owner of Consent contract revoke role and gets mapping and index updated", async function () {
      // create 2 consent contracts
      await consentFactory
        .connect(owner)
        .createConsent(user2.address, "www.user2uri.com", "USER2");

      await consentFactory
        .connect(owner)
        .createConsent(user2.address, "www.user2uri2.com", "USER22");

      // get the deployed address by looking up the provided name
      deployedConsentAddressArray =
        await consentFactory.getUserDeployedConsentsByIndex(
          user2.address,
          0,
          5,
        );

      const consent1 = await Consent.attach(deployedConsentAddressArray[0]);
      const consent2 = await Consent.attach(deployedConsentAddressArray[1]);

      // grant user 3 REQUESTER_ROLE in both consent contracts
      await consent1
        .connect(user2)
        .grantRole(requesterRoleBytes, accounts[3].address);
      await consent2
        .connect(user2)
        .grantRole(requesterRoleBytes, accounts[3].address);

      // revoke user 3's REQUESTER_ROLE
      await consent1
        .connect(user2)
        .revokeRole(requesterRoleBytes, accounts[3].address);

      const userArrayCount = await consentFactory.getUserRoleAddressesCount(
        accounts[3].address,
        requesterRoleBytes,
      );
      expect(userArrayCount).to.eq(1);

      const userArray = await consentFactory.getUserRoleAddressesCountByIndex(
        accounts[3].address,
        requesterRoleBytes,
        0,
        5,
      );
      expect(userArray.length).to.eq(1);

      const firstIndex = await consentFactory.addressToUserRolesArrayIndex(
        accounts[3].address,
        requesterRoleBytes,
        deployedConsentAddressArray[0],
      );
      const secondIndex = await consentFactory.addressToUserRolesArrayIndex(
        accounts[3].address,
        requesterRoleBytes,
        deployedConsentAddressArray[1],
      );

      expect(firstIndex).to.eq(0);
      expect(secondIndex).to.eq(0);
    });

    it("Allows user to renounce their role Consent contract and gets mapping and index updated", async function () {
      // create 2 consent contracts
      await consentFactory
        .connect(owner)
        .createConsent(user2.address, "www.user2uri.com", "USER2");

      await consentFactory
        .connect(owner)
        .createConsent(user2.address, "www.user2uri2.com", "USER22");

      // get the deployed address by looking up the provided name
      deployedConsentAddressArray =
        await consentFactory.getUserDeployedConsentsByIndex(
          user2.address,
          0,
          5,
        );

      const consent1 = await Consent.attach(deployedConsentAddressArray[0]);
      const consent2 = await Consent.attach(deployedConsentAddressArray[1]);

      // grant user 3 REQUESTER_ROLE in both consent contracts
      await consent1
        .connect(user2)
        .grantRole(requesterRoleBytes, accounts[3].address);
      await consent2
        .connect(user2)
        .grantRole(requesterRoleBytes, accounts[3].address);

      // user 3 renounces REQUESTER_ROLE
      await consent1
        .connect(accounts[3])
        .renounceRole(requesterRoleBytes, accounts[3].address);

      const userArrayCount = await consentFactory.getUserRoleAddressesCount(
        accounts[3].address,
        requesterRoleBytes,
      );
      expect(userArrayCount).to.eq(1);

      const userArray = await consentFactory.getUserRoleAddressesCountByIndex(
        accounts[3].address,
        requesterRoleBytes,
        0,
        5,
      );
      expect(userArray.length).to.eq(1);

      const firstIndex = await consentFactory.addressToUserRolesArrayIndex(
        accounts[3].address,
        requesterRoleBytes,
        deployedConsentAddressArray[0],
      );
      const secondIndex = await consentFactory.addressToUserRolesArrayIndex(
        accounts[3].address,
        requesterRoleBytes,
        deployedConsentAddressArray[1],
      );

      expect(firstIndex).to.eq(0);
      expect(secondIndex).to.eq(0);
    });
  });

  describe("_queryList", function () {
    it("Returns empty array if queried result is empty", async function () {
      // get the deployed address by looking up the provided name
      deployedConsentAddressArray =
        await consentFactory.getUserDeployedConsentsByIndex(
          user2.address,
          0,
          5,
        );

      expect(deployedConsentAddressArray.length).to.eq(0);
    });

    it("Query with ending index larger than starting index returns error", async function () {
      // get the deployed address by looking up the provided name

      await expect(
        consentFactory.getUserDeployedConsentsByIndex(user2.address, 5, 1),
      ).to.revertedWith(
        "ConsentFactory: Ending index must be larger then starting index",
      );
    });

    it("Query within range of array returns the correct items", async function () {
      //create 10 consents
      for (let i = 0; i < 10; i++) {
        await consentFactory
          .connect(owner)
          .createConsent(user2.address, "www.user2uri.com", "USER2");
      }

      // get the deployed address by looking up the provided name
      deployedConsentAddressArrayOri =
        await consentFactory.getUserDeployedConsentsByIndex(
          user2.address,
          0,
          20,
        );

      deployedConsentAddressArray =
        await consentFactory.getUserDeployedConsentsByIndex(
          user2.address,
          2,
          7,
        );

      expect(deployedConsentAddressArray.length).to.eq(6);
    });
  });
});
