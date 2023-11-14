// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers, upgrades } = require("hardhat");

const { logTXDetails, REWARD } = require("../tasks/constants.js");

// declare variables that need to be referenced by other functions
let accounts;
let owner;
let user;
let rewardContractAddress;

const fs = require("fs");
const path = require("path");

/* const getRewardABI = () => {
  try {
    const dir = path.resolve(
      __dirname,
      "../artifacts/contracts/testing/Reward.sol/Reward.json",
    );
    const file = fs.readFileSync(dir, "utf8");
    const json = JSON.parse(file);
    const abi = json.abi;
    console.log(`abi`, abi);

    return abi;
  } catch (e) {
    console.log(`e`, e);
  }
}; */

async function setLocalAccounts() {
  accounts = await ethers.getSigners();
  owner = accounts[0];
  user = accounts[1];
}

async function deployRewards() {
  console.log("");
  console.log("Deploying another Test Reward contract for pre-minting...");

  const Reward = await ethers.getContractFactory("Reward");

  const reward = await Reward.deploy("TestReward", "TR", "www.test-reward.com");
  const reward_receipt = await reward.deployTransaction.wait();

  console.log(`Reward deployed to contract address: ${owner.address}...`);
  rewardContractAddress = reward.address;
}

// Funciont that creates rewards and mints some tokens on it
async function premintReward() {
  await setLocalAccounts();

  console.log("");
  console.log("Setting up scenario of pre-minted NFTs...");
  console.log("");
  console.log(`Creating a user, ${user.address} that has pre-minted NFTs...`);
  console.log("");
  console.log(`Deploy a rewards contract from ${owner.address}...`);
  console.log("");
  await deployRewards();

  const rewardContract = new ethers.Contract(
    rewardContractAddress,
    REWARD().abi,
    user,
  );

  console.log(`Minting a few NFTs to ${user.address}...`);

  let tokenIds = [];

  for (let i = 0; i < 5; i++) {
    await rewardContract.connect(owner).safeMint(user.address);
    tokenIds.push(i);
    console.log(`Minted token id ${i}...`);
  }

  await console.log("");
  console.log(
    `Pre-minted token ids ${tokenIds} to ${user.address} on reward contract address ${rewardContractAddress} by owner ${owner.address}.`,
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
