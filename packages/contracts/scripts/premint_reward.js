const { ethers, upgrades } = require("hardhat");

const { logTXDetails, REWARD } = require("../tasks/constants.js");

// declare variables that need to be referenced by other functions
let accounts;
let owner;
let user;
let rewardContractAddress;

async function setLocalAccounts() {
  accounts = await ethers.getSigners();
  owner = accounts[0];
  user = accounts[1];
}

async function deployRewards() {
  const Reward = await ethers.getContractFactory("Reward");

  const reward = await Reward.deploy("TestReward", "TR", "www.test-reward.com");
  const reward_receipt = await reward.deployTransaction.wait();

  console.log(
    `\u2592 Reward deployed to contract address: ${reward.address} by owner ${owner.address}...\n`,
  );
  rewardContractAddress = reward.address;
}

// Function that creates rewards and mints some tokens on it
async function premintReward() {
  // Setup account variables
  await setLocalAccounts();

  console.log(`Setting up scenario of pre-minted NFTs...\n`);
  console.log(
    `\u2592 Creating a user, ${user.address} who will have pre-minted NFTs...\n`,
  );
  console.log(
    `\u2592 Deploying a rewards contract from owner ${owner.address}...\n`,
  );

  // Deploy rewards contract
  await deployRewards();

  const rewardContract = new ethers.Contract(
    rewardContractAddress,
    REWARD().abi,
    user,
  );

  console.log(`\u2592 Minting a few NFTs to ${user.address}...\n`);

  let tokenIds = [];

  for (let i = 0; i < 5; i++) {
    await rewardContract.connect(owner).safeMint(user.address);
    tokenIds.push(i);
    console.log(`\u2592 Minted token id ${i}...`);
  }

  console.log(
    `\nSuccess! Pre-minted token ids ${tokenIds} to ${user.address} on reward contract address ${rewardContractAddress} by owner ${owner.address}.\n`,
  );

  console.log(
    `\u2592 Note: ${owner.address} is account number 0 in the Hardhat's Configured HD wallet...`,
  );
  console.log(
    `\u2592 Note: ${user.address} is account number 1 in the Hardhat's Configured HD wallet...\n`,
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
premintReward()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
