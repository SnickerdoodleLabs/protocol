// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
//const { ethers, upgrades } = require("hardhat");

// declare variables that need to be referenced by other functions
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

// function that runs the full deployment of all contracts
async function fullDeployment() {
  await deployConsent();

  console.log("");
  console.log("Consent Contract implementation deployment successful!");
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
