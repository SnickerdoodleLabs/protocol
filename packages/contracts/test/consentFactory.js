const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

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

  let accounts;
  let owner;
  let user1;
  let user2;
  let trustedForwarder;
  let beacon;

  const pauserRoleBytes = ethers.utils.id("PAUSER_ROLE");
  const signerRoleBytes = ethers.utils.id("SIGNER_ROLE");
  const defaultAdminRoleBytes = ethers.utils.formatBytes32String(0); //bytes for DEFAULT_ADMIN_ROLE on the contract is 0 by default

  beforeEach(async () => {
    accounts = await hre.ethers.getSigners();
    owner = accounts[0];
    user1 = accounts[1];
    user2 = accounts[2];
    trustedForwarder = accounts[19];

    // deploy the Consent contract
    Consent = await ethers.getContractFactory("Consent");
    consent = await Consent.deploy();
    await consent.deployed();
    consentAddress = getAddress(consent);

    // deploy the Consent Factory contract before each test
    ConsentFactory = await ethers.getContractFactory("ConsentFactory");
    consentFactory = await ConsentFactory.deploy(trustedForwarder.address);
    await consentFactory.deployed();

    // deploy the UpgradeableBeacon
    beacon = await upgrades.deployBeacon(Consent);
    // set the UpgradeableBeacon address on the Consent Factory
    await consentFactory.connect(owner).setBeaconAddress(beacon.address);
  });

  describe("createConsent", function () {
    it("Deploys a Beacon Proxy pointing to a new instance of a Consent contract", async function () {
      // create a consent contract
      await consentFactory
        .connect(owner)
        .createConsent(user1.address, "www.user1uri.com", "USER1");

      // get the deployed address by looking up the provided name
      const deployedConsentAddress = await consentFactory
        .connect(owner)
        .contractNameToAddress("USER1");

      // attach the deployed Consent address and check it's uri
      const deployedConsentInstance = consent.attach(deployedConsentAddress);

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

      // get the deployed address by looking up the provided name
      const deployedConsentAddress1 = await consentFactory
        .connect(owner)
        .contractNameToAddress("USER2");

      const deployedConsentAddress2 = await consentFactory
        .connect(owner)
        .contractNameToAddress("USER22");

      // attach the deployed Consent address and check it's uri
      const deployedConsentInstance1 = consent.attach(deployedConsentAddress1);
      const deployedConsentInstance2 = consent.attach(deployedConsentAddress2);

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
      const deployedConsentAddress = await consentFactory
        .connect(owner)
        .contractNameToAddress("USER1");

      // attach the deployed Consent address and check it's uri
      const deployedConsentInstance = consent.attach(deployedConsentAddress);

      // check the base uri
      expect(await deployedConsentInstance.connect(owner).baseURI()).to.eq(
        "www.user1uri.com",
      );
    });
  });

  describe("UpgradableBeacon test", function () {
    it("Upgrade the Consent implementation contract with HardHat Upgrades and check", async function () {
      let Consent = await ethers.getContractFactory("Consent");
      let ConsentV2 = await ethers.getContractFactory("ConsentV2");

      const beacon = await upgrades.deployBeacon(Consent);

      await consentFactory.connect(owner).setBeaconAddress(beacon.address);

      await consentFactory
        .connect(owner)
        .createConsent(user1.address, "www.user1uri.com", "USER1");

      // get the deployed address by looking up the provided name
      const deployedConsentAddress = await consentFactory
        .connect(owner)
        .contractNameToAddress("USER1");

      // attach the deployed Consent address and check it's uri
      const deployedConsentInstance = consent.attach(deployedConsentAddress);

      expect(await deployedConsentInstance.connect(owner).baseURI()).to.eq(
        "www.user1uri.com",
      );

      // Upgrade the beacon using hardhat upgrades
      await upgrades.upgradeBeacon(beacon, ConsentV2);

      // attach the proxy's address to the new contract
      const upgraded = ConsentV2.attach(deployedConsentAddress);

      await upgraded.setIsVersion2();

      const check = await upgraded.getIsVersion2();

      expect(check).to.eq(true);
    });

    it("Upgrade the Consent implementation contract with ABI and check", async function () {
      let Consent = await ethers.getContractFactory("Consent");
      let ConsentV2 = await ethers.getContractFactory("ConsentV2");
      let UpgradeableBeacon = await ethers.getContractFactory(
        "UpgradeableBeacon",
      );

      // TODO: test with contract's deploybeacon and forceImport from hardhat upgrades
      const beacon = await upgrades.deployBeacon(Consent);

      await consentFactory.connect(owner).setBeaconAddress(beacon.address);

      await consentFactory
        .connect(owner)
        .createConsent(user1.address, "www.user1uri.com", "USER1");

      // get the deployed address by looking up the provided name
      const deployedConsentAddress = await consentFactory
        .connect(owner)
        .contractNameToAddress("USER1");

      // attach the deployed Consent address and check it's uri
      const deployedConsentInstance = consent.attach(deployedConsentAddress);

      expect(await deployedConsentInstance.connect(owner).baseURI()).to.eq(
        "www.user1uri.com",
      );

      // Upgrade the beacon using hardhat upgrades
      const beaconInstance = await UpgradeableBeacon.attach(beacon.address);

      // deploy an instance of the new ConsentV2 contract
      ConsentV2 = await ethers.getContractFactory("ConsentV2");
      consentV2 = await ConsentV2.deploy();
      await consentV2.deployed();
      consentAddressV2 = getAddress(consentV2);

      await beaconInstance.upgradeTo(consentAddressV2);

      // attach the proxy's address to the new contract
      const upgraded = ConsentV2.attach(deployedConsentAddress);

      await upgraded.setIsVersion2();

      const check = await upgraded.getIsVersion2();

      expect(check).to.eq(true);
    });
  });
});
