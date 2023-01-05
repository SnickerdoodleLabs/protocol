// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers, upgrades } = require("hardhat");

// declare variables that need to be referenced by other functions
let trustedForwarderAddress;
let consentAddress;

async function upgradeMinimalForwarder() {
  console.log("");
  console.log("Deploying MinimalForwarder contract...");

  const MinimalForwarder = await ethers.getContractFactory(
    "SynamintForwarderUpgradeable",
  );

  // the MinimalForwarder does not require any arguments on deployment
  const upgradeableMinimalForwarder = await upgrades.upgradeProxy("0x444Dc34cCFEBAb2f933c9aa5C293372Ab4E33f30", MinimalForwarder);
  await upgradeableMinimalForwarder.deployed();

  trustedForwarderAddress = upgradeableMinimalForwarder.address;

  console.log("MinimalForwarder deployed to:", trustedForwarderAddress);
}


// function that runs the full deployment of all contracts
async function fullDeployment() {
  await upgradeMinimalForwarder();

  console.log("");
  console.log("upgrade successful!");
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
