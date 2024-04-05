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

// function that deploys the SnickerdoodleGovernor contract (DAO)
async function deployCrumbs() {
  console.log("");
  console.log("Deploying Crumbs contract...");

  const Crumbs = await ethers.getContractFactory("Crumbs");

  // the Crumbs contract requires 2 arguments on deployment:
  // the address of the trusted forwarder address
  // the base uri
  const crumbs = await upgrades.deployProxy(Crumbs, ["0xdB5c885944d903Ac5c146eef400D2ee20572d357", "www.crumbs.com/"])
  await crumbs.deployed();

  console.log("Crumbs deployed to:", crumbs.address);
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
  await deployCrumbs();

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
