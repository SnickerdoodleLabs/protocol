// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const { ethers, upgrades } = require("hardhat");

// declare variables that need to be referenced by other functions
let accounts;
let owner;
let trustedForwarder;
let tokenDistributor;
let consentAddress;
let doodleTokenAddress;
let timelockAddress;

async function setLocalAccounts() {
  accounts = await hre.ethers.getSigners();
  owner = accounts[0];
  console.log(owner.address);
  //for local testing, take the Account #19 hardhat accounts as the trusted forwarder address
  trustedForwarder = accounts[19];

  //for local testing,take the Account #18 of hardhat accounts as the trusted forwarder address
  tokenDistributor = accounts[18];
}

// function to deploy the consent contract
async function deployConsent() {
  console.log("");
  console.log("Deploying Consent implementation contract...");

  const Consent = await hre.ethers.getContractFactory("Consent");
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

  const ConsentFactory = await hre.ethers.getContractFactory("ConsentFactory");

  // the Consent Factory contract requires one argument on deployment:
  // the address of the trusted forwarder who will pay for the meta tx fees
  const consentFactory = await ConsentFactory.deploy(
    trustedForwarder.address,
    consentAddress,
  );
  const consentFactory_receipt = await consentFactory.deployTransaction.wait();

  console.log("ConsentFactory deployed to:", consentFactory.address);
  console.log(
    "ConsentFactory Gas Fee:",
    consentFactory_receipt.gasUsed.toString(),
  );
}

// function that deploys the Doodle Token
async function deployDoodleToken(distributorAddress) {
  console.log("");
  console.log("Deploying Doodle Token contract...");

  const DoodleToken = await hre.ethers.getContractFactory("DoodleToken");

  // the DoodleToken contract requires one argument on deployment:
  // the distribution address that will receive the max token supply
  const doodleToken = await DoodleToken.deploy(distributorAddress);
  const doodleToken_receipt = await doodleToken.deployTransaction.wait();
  doodleTokenAddress = doodleToken.address;

  console.log("DoodleToken deployed to:", doodleToken.address);
  console.log("DoodleToken Gas Fee:", doodleToken_receipt.gasUsed.toString());
}

// function that deploys the Doodle Token
async function deployWDoodleToken(distributorAddress) {
  console.log("");
  console.log("Deploying Wrapped Doodle Token contract...");

  const WDoodleToken = await hre.ethers.getContractFactory("WDoodleToken");

  // the WDoodleToken contract requires one argument on deployment:
  // the distribution address that will receive the max token supply
  const wDoodleToken = await WDoodleToken.deploy(distributorAddress);
  const wDoodleToken_receipt = await wDoodleToken.deployTransaction.wait();
  doodleTokenAddress = wDoodleToken.address;

  console.log("WDoodleToken deployed to:", wDoodleToken.address);
  console.log("WDoodleToken Gas Fee:", wDoodleToken_receipt.gasUsed.toString());
}

// function that deploys the Timelock Controller
async function deployTimelockController() {
  console.log("");
  console.log("Deploying Timelock Controller contract...");

  const Timelock = await hre.ethers.getContractFactory("SnickerdoodleTimelock");

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

  const Governor = await hre.ethers.getContractFactory("SnickerdoodleGovernor");

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

  const Crumbs = await hre.ethers.getContractFactory("Crumbs");

  // the Crumbs contract requires 2 arguments on deployment:
  // the address of the trusted forwarder address
  // the base uri
  const crumbs = await Crumbs.deploy(
    trustedForwarder.address,
    "www.crumbs.com/",
  );
  const crumbs_receipt = await crumbs.deployTransaction.wait();

  console.log("Crumbs deployed to:", crumbs.address);
  console.log("Crumbs Gas Fee:", crumbs_receipt.gasUsed.toString());
}

// function that deploys the SnickerdoodleGovernor contract (DAO)
async function deploySift() {
  console.log("");
  console.log("Deploying Sift contract...");

  const Sift = await hre.ethers.getContractFactory("Sift");

  // the Sift contract requires 1 argument on deployment:
  // the base uri
  const sift = await Sift.deploy("www.sift.com/");
  const sift_receipt = await sift.deployTransaction.wait();

  console.log("Sift deployed to:", sift.address);
  console.log("Sift Gas Fee:", sift_receipt.gasUsed.toString());
}

async function deployMinimalForwarder() {
  console.log("");
  console.log("Deploying MinimalForwarder contract...");

  const MinimalForwarder = await hre.ethers.getContractFactory(
    "MinimalForwarder",
  );

  // the MinimalForwarder does not require any arguments on deployment
  const minimalForwarder = await MinimalForwarder.deploy();
  const minimalForwarder_receipt =
    await minimalForwarder.deployTransaction.wait();

  console.log("MinimalForwarder deployed to:", minimalForwarder.address);
  console.log(
    "MinimalForwarder Gas Fee:",
    minimalForwarder_receipt.gasUsed.toString(),
  );
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

  // If deploying to subnet, deploy the wrappedDoodleToken instead
  if (hre.network.name == "subnet") {
    await deployWDoodleToken(tokenDistributor.address);
  } else {
    await deployDoodleToken(tokenDistributor.address);
  }
  await deployTimelockController();
  await deploySnickerdoodleDAO();

  await deployCrumbs();
  await deploySift();

  await deployMinimalForwarder();

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
