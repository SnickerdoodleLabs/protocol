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
    consentFactory = await ConsentFactory.deploy(
      trustedForwarder.address,
      consentImpAddress,
    );
    await consentFactory.deployed();
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

  describe("addUserConsent", function () {
    it("Does not allow address that was not deployed by the ConsentFactory to add user consent", async function () {
      // create a consent contract
      await expect(
        consentFactory.connect(owner).addUserConsents(user1.address),
      ).to.revertedWith("ConsentFactory: Caller is not a Consent Contract");
    });

    it("When user opts-in, adds to their consent array and adds the correct index in the array", async function () {
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

      // user 1 opts in to both
      const consent1 = await Consent.attach(deployedConsentAddressArray[0]);
      const consent2 = await Consent.attach(deployedConsentAddressArray[1]);

      await consent1.connect(user1).optIn(1, agreementFlags1);
      await consent2.connect(user1).optIn(2, agreementFlags1);

      const userArrayCount = await consentFactory.getUserConsentAddressesCount(
        user1.address,
      );
      expect(userArrayCount).to.eq(2);

      const userArray = await consentFactory.getUserConsentAddressesByIndex(
        user1.address,
        0,
        5,
      );
      expect(userArray.length).to.eq(2);

      const firstIndex = await consentFactory.addressToUserArrayIndex(
        user1.address,
        deployedConsentAddressArray[0],
      );
      const secondIndex = await consentFactory.addressToUserArrayIndex(
        user1.address,
        deployedConsentAddressArray[1],
      );

      expect(firstIndex).to.eq(0);
      expect(secondIndex).to.eq(1);
    });
  });

  describe("removeUserConsent", function () {
    it("Does not allow address that was not deployed by the ConsentFactory to remove user consent", async function () {
      // create a consent contract
      await expect(
        consentFactory.connect(owner).removeUserConsents(user1.address),
      ).to.revertedWith("ConsentFactory: Caller is not a Consent Contract");
    });

    it("When user opts-out, remove from their consent array and update the index mapping", async function () {
      // create 2 consent contracts
      await consentFactory
        .connect(owner)
        .createConsent(user2.address, "www.user2uri.com", "USER2");

      await consentFactory
        .connect(owner)
        .createConsent(user2.address, "www.user2uri2.com", "USER22");

      await consentFactory
        .connect(owner)
        .createConsent(user2.address, "www.user2uri3.com", "USER23");

      // get the deployed address by looking up the provided name
      deployedConsentAddressArray =
        await consentFactory.getUserDeployedConsentsByIndex(
          user2.address,
          0,
          5,
        );

      // user 1 opts in to all 3
      const consent1 = await Consent.attach(deployedConsentAddressArray[0]);
      const consent2 = await Consent.attach(deployedConsentAddressArray[1]);
      const consent3 = await Consent.attach(deployedConsentAddressArray[2]);

      await consent1.connect(user1).optIn(1, agreementFlags1);
      await consent2.connect(user1).optIn(2, agreementFlags2);
      await consent3.connect(user1).optIn(3, agreementFlags3);

      // user 1 opts out of 1
      await consent1.connect(user1).optOut(1);

      const userArrayCount = await consentFactory.getUserConsentAddressesCount(
        user1.address,
      );
      expect(userArrayCount).to.eq(2);

      const userArray = await consentFactory.getUserConsentAddressesByIndex(
        user1.address,
        0,
        5,
      );

      expect(userArray.length).to.eq(2);

      const firstIndex = await consentFactory.addressToUserArrayIndex(
        user1.address,
        deployedConsentAddressArray[0],
      );
      const secondIndex = await consentFactory.addressToUserArrayIndex(
        user1.address,
        deployedConsentAddressArray[1],
      );
      const thirdIndex = await consentFactory.addressToUserArrayIndex(
        user1.address,
        deployedConsentAddressArray[2],
      );

      expect(firstIndex).to.eq(0);
      expect(secondIndex).to.eq(1);
      expect(thirdIndex).to.eq(0);
    });
  });

  describe("addUserRole", function () {
    it("Does not allow address that was not deployed by the ConsentFactory to add user roles", async function () {
      // create a consent contract
      await expect(
        consentFactory.connect(owner).removeUserConsents(user1.address),
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
        consentFactory.connect(owner).removeUserConsents(user1.address),
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
