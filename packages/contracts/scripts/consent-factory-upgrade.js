// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers, upgrades } = require("hardhat");

// function to deploy the Consent Factory contract
async function upgradeConsentFactory() {
  console.log("");
  console.log("Deploying Consent Factory contract...");

  const ConsentFactory = await ethers.getContractFactory("ConsentFactory");

  // the Consent Factory contract requires one argument on deployment:
  // the address of the trusted forwarder who will pay for the meta tx fees
  const upgradedConsentFactory = await upgrades.upgradeProxy("0x2231A160C7a7bba5a9dDbaF6a44A7EF76Ef74C77", ConsentFactory);

  console.log("ConsentFactory upgraded:", upgradedConsentFactory);
}

// function that runs the full deployment of all contracts
async function fullDeployment() {
  await upgradeConsentFactory();

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
