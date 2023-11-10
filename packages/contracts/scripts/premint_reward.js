// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers, upgrades } = require("hardhat");

const {
  RewardABI,
} = require("../artifacts/contracts/testing/Reward.sol/Reward.json");
const { logTXDetails } = require("../tasks/constants.js");

// declare variables that need to be referenced by other functions
let accounts;
let owner;
let user;
let rewardContractAddress;

async function setLocalAccounts() {
  accounts = await ethers.getSigners();
  owner = accounts[0];
  user = accounts[1];
  console.log(user.address);
}

async function deployRewards() {
  console.log("");
  console.log("Deploying Test Reward contract...");

  const Reward = await ethers.getContractFactory("Reward");

  // the MinimalForwarder does not require any arguments on deployment
  const reward = await Reward.deploy();
  const reward_receipt = await reward.deployTransaction.wait();

  console.log("Reward deployed to:", reward.address);
  rewardContractAddress = reward.address;
}

// Funciont that creates rewards and mints some tokens on it
async function premintReward() {
  console.log(`Creating a user, ${user2.address} that has pre-minted NFTs...`);

  console.log(`Deploy a rewards contract from ${owner.address}...`);

  await setLocalAccounts();
  await deployRewards();

  const rewardContract = new ethers.Contract(
    rewardContractAddress,
    RewardABI.abi,
    user,
  );

  console.log(`Minting a few NFTs to ${user.address}...`);

  let tokenIds;

  for (let i = 0; i < 5; i++) {
    await rewardContract.safeMint(user.address);
    tokenIds.push(i);
    console.log(`Minted token id ${i}...`);
  }

  await console.log("");
  console.log(
    `Pre-minted ${tokenIds} to ${user.address} on reward contract address ${rewardContractAddress}.`,
  );
  console.log("");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
premintReward()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
