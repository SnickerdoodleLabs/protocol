// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers, upgrades } = require("hardhat");

// declare variables that need to be referenced by other functions
let accounts;
let owner;
let trustedForwarderAddress;

async function setLocalAccounts() {
  accounts = await ethers.getSigners();
  owner = accounts[0];
  console.log(owner.address);

  //for local testing,take the Account #18 of hardhat accounts as the trusted forwarder address
  tokenDistributor = accounts[18];
}

async function deploySift() {
  console.log("");
  console.log("Deploying sift contract...");

  const Sift = await ethers.getContractFactory("Sift");

  // the sift contract requires 2 arguments on deployment:
  // the address of the trusted forwarder address
  // the base uri
  const sift = await upgrades.deployProxy(Sift, ["ipfs"]);
  await sift.deployed();

  console.log("sift deployed to:", sift.address);
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
  await deploySift();

  console.log("");
  console.log("Sift deployment successful!");
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
