// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
//const { ethers, upgrades } = require("hardhat");

// declare variables that need to be referenced by other functions
let trustedForwarderAddress;
let consentAddress;

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
    trustedForwarderAddress,
    consentAddress,
  );
  const consentFactory_receipt = await consentFactory.deployTransaction.wait();

  console.log("ConsentFactory deployed to:", consentFactory.address);
  console.log(
    "ConsentFactory Gas Fee:",
    consentFactory_receipt.gasUsed.toString(),
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
    trustedForwarderAddress,
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

  trustedForwarderAddress = minimalForwarder.address;

  console.log("MinimalForwarder deployed to:", minimalForwarder.address);
  console.log(
    "MinimalForwarder Gas Fee:",
    minimalForwarder_receipt.gasUsed.toString(),
  );
}

// function that runs the full deployment of all contracts
async function fullDeployment() {
  await deployMinimalForwarder();
  await deployConsent();
  await deployConsentFactory();
  await deployCrumbs();
  await deploySift();

  console.log("");
  console.log("Full deployment successful!");
  console.log("");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
fullDeployment()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
