// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers, upgrades } = require("hardhat");
const { logTXDetails } = require("../tasks/constants.js");

// declare variables that need to be referenced by other functions
let accounts;
let owner;
let trustedForwarderAddress;
let tokenDistributor;
let consentAddress;
let doodleTokenAddress;
let timelockAddress;

async function setLocalAccounts() {
  accounts = await ethers.getSigners();
  owner = accounts[0];
  console.log(owner.address);

  //for local testing,take the Account #18 of hardhat accounts as the trusted forwarder address
  tokenDistributor = accounts[18];
}

async function deployMinimalForwarder() {
  console.log("");
  console.log("Deploying MinimalForwarder contract...");

  const MinimalForwarder = await ethers.getContractFactory(
    "SynamintForwarderUpgradeable",
  );

  // the MinimalForwarder does not require any arguments on deployment
  const upgradeableMinimalForwarder = await upgrades.deployProxy(MinimalForwarder, []);
  await upgradeableMinimalForwarder.deployed();

  trustedForwarderAddress = upgradeableMinimalForwarder.address;

  console.log("MinimalForwarder deployed to:", trustedForwarderAddress);
}

// function to deploy the consent contract
async function deployConsent() {
  console.log("");
  console.log("Deploying Consent implementation contract...");

  const Consent = await ethers.getContractFactory("Consent");
  const consent = await Consent.deploy();
  const consent_receipt = await consent.deployTransaction.wait();
  consentAddress = consent.address;

  console.log("Consent deployed to:", consent.address);
  console.log("Consent Gas Fee:", consent_receipt.gasUsed.toString());
}

// function to deploy the Consent Factory contract
async function deployConsentFactory() {
  console.log("");
  console.log("Deploying Consent Factory contract...");

  const ConsentFactory = await ethers.getContractFactory("ConsentFactory");

  // the Consent Factory contract requires one argument on deployment:
  // the address of the trusted forwarder who will pay for the meta tx fees
  const upgradeableConsentFactory = await upgrades.deployProxy(ConsentFactory, [trustedForwarderAddress, consentAddress])
  await upgradeableConsentFactory.deployed();

  console.log("ConsentFactory deployed to:", upgradeableConsentFactory.address);

  await upgradeableConsentFactory.newListingHead(5, "QmTPfcSAr5FKWDmjbyudNae5NMAreqZfYqWUGFzvuWZQDh").then(
    (txrcpt) => {
      return txrcpt.wait();
    })
    .then((txrct) => {
      logTXDetails(txrct);
    });
}

// function that deploys the Doodle Token
async function deployDoodleToken(distributorAddress) {
  console.log("");
  console.log("Deploying Doodle Token contract...");

  const DoodleToken = await ethers.getContractFactory("DoodleToken");

  // the DoodleToken contract requires one argument on deployment:
  // the distribution address that will receive the max token supply
  const doodleToken = await DoodleToken.deploy(distributorAddress);
  const doodleToken_receipt = await doodleToken.deployTransaction.wait();
  doodleTokenAddress = doodleToken.address;

  console.log("DoodleToken deployed to:", doodleToken.address);
  console.log("DoodleToken Gas Fee:", doodleToken_receipt.gasUsed.toString());
}

// function that deploys the Timelock Controller
async function deployTimelockController() {
  console.log("");
  console.log("Deploying Timelock Controller contract...");

  const Timelock = await ethers.getContractFactory("SnickerdoodleTimelock");

  // the SnickerdoodleTimeLock contract requires 3 arguments on deployment:
  // the min Delay in seconds
  // array of addresses of proposers
  // array of addresses of executors
  const timelock = await Timelock.deploy(1000, [], []);
  const timelock_receipt = await timelock.deployTransaction.wait();
  timelockAddress = timelock.address;

  console.log("SnickerdoodleTimeLock deployed to:", timelockAddress);
  console.log(
    "SnickerdoodleTimeLock Gas Fee:",
    timelock_receipt.gasUsed.toString(),
  );
}

// function that deploys the SnickerdoodleGovernor contract (DAO)
async function deploySnickerdoodleDAO() {
  console.log("");
  console.log("Deploying SnickerdoodleGovernor (DAO) contract...");

  const Governor = await ethers.getContractFactory("SnickerdoodleGovernor");

  // the SnickerdoodleGovernor contract requires 2 arguments on deployment:
  // the address of the ERC20Votes token
  // the address of the Timelock
  const governor = await Governor.deploy(doodleTokenAddress, timelockAddress);
  const governor_receipt = await governor.deployTransaction.wait();

  console.log("SnickerdoodleGovernor deployed to:", governor.address);
  console.log(
    "SnickerdoodleGovernor Gas Fee:",
    governor_receipt.gasUsed.toString(),
  );
}

// function that deploys the SnickerdoodleGovernor contract (DAO)
async function deployCrumbs() {
  console.log("");
  console.log("Deploying Crumbs contract...");

  const Crumbs = await ethers.getContractFactory("Crumbs");

  // the Crumbs contract requires 2 arguments on deployment:
  // the address of the trusted forwarder address
  // the base uri
  const crumbs = await upgrades.deployProxy(Crumbs, [trustedForwarderAddress, "www.crumbs.com/"])
  await crumbs.deployed();

  console.log("Crumbs deployed to:", crumbs.address);
}

// function that deploys the SnickerdoodleGovernor contract (DAO)
async function deploySift() {
  console.log("");
  console.log("Deploying Sift contract...");

  const Sift = await ethers.getContractFactory("Sift");

  // the Sift contract requires 1 argument on deployment:
  // the base uri
  const sift = await Sift.deploy("www.sift.com/");
  const sift_receipt = await sift.deployTransaction.wait();

  console.log("Sift deployed to:", sift.address);
  console.log("Sift Gas Fee:", sift_receipt.gasUsed.toString());

  await sift
    .verifyURL("snickerdoodle.com", accounts[0].address)
    .then((txResponse) => {
      return txResponse.wait();
    })
    .then((txrct) => {
      logTXDetails(txrct);
    });

  await sift
    .maliciousURL("webthree.love", accounts[0].address)
    .then((txResponse) => {
      return txResponse.wait();
    })
    .then((txrct) => {
      logTXDetails(txrct);
    });
}

async function deployRewards() {
  console.log("");
  console.log("Deploying Test Reward contract...");

  const Reward = await ethers.getContractFactory("Reward");

  // the MinimalForwarder does not require any arguments on deployment
  const reward = await Reward.deploy();
  const reward_receipt = await reward.deployTransaction.wait();

  console.log("Reward deployed to:", reward.address);
  console.log("Reward Gas Fee:", reward_receipt.gasUsed.toString());
}

// function that runs the full deployment of all contracts
async function fullDeployment() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  await setLocalAccounts();
  await deployMinimalForwarder();
  await deployConsent();
  await deployConsentFactory();
  await deployDoodleToken(tokenDistributor.address);
  await deployTimelockController();
  await deploySnickerdoodleDAO();
  await deployCrumbs();
  await deploySift();
  await deployRewards();

  console.log("");
  console.log("Full deployment successful!");
  console.log("");
}

// function that only deploys the DoodleToken and DAO contracts
async function deployTokenAndDAO() {
  await deployDoodleToken("0xf318dE2eBb38aa3dD1845ef2206c7C9A03B652cD");
  await deployTimelockController();
  await deploySnickerdoodleDAO();
}

/*
DoodleToken deployed to: 0x3d02FC49ec1888fB38Ba97C65951D3d059459040

Deploying Timelock Controller contract...
SnickerdoodleTimeLock deployed to: 0x7B4D76E861b8663E10bBEbF5CE36B0646a969F6b

Deploying SnickerdoodleGovernor (DAO) contract...
SnickerdoodleGovernor deployed to: 0x1E9f945bd0300D2BB5C68c33dE9B556c8f0F6565
*/

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
fullDeployment()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
