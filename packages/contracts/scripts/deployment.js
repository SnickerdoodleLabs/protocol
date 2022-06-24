// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const { ethers, upgrades } = require("hardhat");

// declare variables and set them as functions are called so that it can be referenced by other functions
let accounts;
let owner;
let trustedForwarder;
let tokenDistributor;
let consentAddress;
let consentFactoryAddress;
let beacon;
let beaconAddress;
let Consent;
let ConsentFactory;
let consent;
let consentFactory;
let doodleTokenAddress;
let timelockAddress;

async function setLocalAccounts() {
  accounts = await hre.ethers.getSigners();
  owner = accounts[0];
  //for local testing, take the 20th address of hardhat accounts as the trusted forwarder address
  trustedForwarder = accounts[19];

  //for local testing,take the 19th address of hardhat accounts as the trusted forwarder address
  tokenDistributor = accounts[18];
}

// function to deploy the consent contract
async function deployConsent() {
  console.log("");
  console.log("Deploying Consent implementation contract...");
  // We get the contract to deploy
  Consent = await hre.ethers.getContractFactory("Consent");
  consent = await Consent.deploy();
  await consent.deployed();
  consentAddress = consent.address;

  console.log("Consent implementation contract deployed to:", consentAddress);
}

// function to deploy the Consent Factory contract
async function deployConsentFactory() {
  console.log("");
  console.log("Deploying Consent Factory contract...");
  ConsentFactory = await hre.ethers.getContractFactory("ConsentFactory");

  // the Consent Factory contract requires one argument on deployment:
  // the address of the trusted forwarder who will pay for the meta tx fees
  consentFactory = await ConsentFactory.deploy(trustedForwarder.address);
  await consentFactory.deployed();
  consentFactoryAddress = consentFactory.address;

  console.log("Consent Factory deployed to:", consentFactoryAddress);
}

// function to deploy the Upgradeable Beacon contract
async function deployUpgradeableBeacon() {
  console.log("");
  console.log("Deploying UpgradeableBeacon contract...");

  // the UpgradeableBeacon contract requires one argument on deployment:
  // the implementation contract details
  beacon = await upgrades.deployBeacon(Consent);
  beaconAddress = beacon.address;
  console.log("UpgradeableBeacon deployed to:", beaconAddress);
}

// function that deploys the Doodle Token
async function deployDoodleToken(distributorAddress) {
  console.log("");
  console.log("Deploying Doodle Token contract...");
  DoodleToken = await hre.ethers.getContractFactory("DoodleToken");

  // the DoodleToken contract requires one argument on deployment:
  // the distribution address that will receive the max token supply
  doodleToken = await DoodleToken.deploy(distributorAddress);
  await doodleToken.deployed();
  doodleTokenAddress = doodleToken.address;

  console.log("DoodleToken deployed to:", doodleTokenAddress);
}

// function that deploys the Timelock Controller
async function deployTimelockController() {
  console.log("");
  console.log("Deploying Timelock Controller contract...");
  Timelock = await hre.ethers.getContractFactory("SnickerdoodleTimelock");

  // the SnickerdoodleTimeLock contract requires 3 arguments on deployment:
  // the min Delay in seconds
  // array of addresses of proposers
  // array of addresses of executors
  timelock = await Timelock.deploy(1000, [], []);
  await timelock.deployed();
  timelockAddress = timelock.address;

  console.log("SnickerdoodleTimeLock deployed to:", timelockAddress);
}

// function that deploys the SnickerdoodleGovernor contract (DAO)
async function deploySnickerdoodleDAO() {
  console.log("");
  console.log("Deploying SnickerdoodleGovernor (DAO) contract...");
  Governor = await hre.ethers.getContractFactory("SnickerdoodleGovernor");

  // the SnickerdoodleGovernor contract requires 2 arguments on deployment:
  // the address of the ERC20Votes token
  // the addres of the Timelock
  governor = await Governor.deploy(doodleTokenAddress, timelockAddress);
  await governor.deployed();
  governorAddress = governor.address;

  console.log("SnickerdoodleGovernor deployed to:", governorAddress);
}

// function that deploys the SnickerdoodleGovernor contract (DAO)
async function deployCrumbs() {
  console.log("");
  console.log("Deploying Crumbs contract...");
  Crumbs = await hre.ethers.getContractFactory("Crumbs");

  // the SnickerdoodleGovernor contract requires 1 argument on deployment:
  // the address of the ERC20Votes token
  // the addres of the Timelock
  crumbs = await Crumbs.deploy(trustedForwarder.address, "www.crumbs.com/");
  await crumbs.deployed();
  crumbsAddress = crumbs.address;

  console.log("Crumbs deployed to:", crumbsAddress);
}

// funciton to set the Upgradeable Beacon address on the Consent Factory contract
// Note: the Upgradeable Beacon contract has to be deployed first!
async function setBeaconAddressOnConsentFactory() {
  console.log("");
  console.log("Setting beacon's address on Consent Factory...");
  await consentFactory.connect(owner).setBeaconAddress(beaconAddress);
  console.log("Beacon address on Consent Factory set to:", beaconAddress);
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
  await deployConsent();
  await deployConsentFactory();
  await deployUpgradeableBeacon();
  await setBeaconAddressOnConsentFactory();

  await deployDoodleToken(tokenDistributor.address);
  await deployTimelockController();
  await deploySnickerdoodleDAO();

  await deployCrumbs();

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
