// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers, upgrades } = require("hardhat");

// declare variables that need to be referenced by other functions
let trustedForwarderAddress;
let consentAddress;

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
}

// function that runs the full deployment of all contracts
async function fullDeployment() {
  await deployMinimalForwarder();
  await deployConsent();
  await deployConsentFactory();

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
