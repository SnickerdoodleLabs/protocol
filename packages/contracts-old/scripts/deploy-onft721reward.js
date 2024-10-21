// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
//const { ethers, upgrades } = require("hardhat");

// declare variables that need to be referenced by other functions
let onft721RewardAddress;

// function to deploy the consent contract
async function deployONFT721Reward() {
  console.log("");
  console.log("Deploying ONFT721Reward contract...");

  const ONFT721Reward = await hre.ethers.getContractFactory("ONFT721Reward");

  const name = "Snickerdoodle ONFT721";
  const symbol = "SDLONFT721";
  const baseURI = "test.com";
  // Referenced Lazyer Zero docs - gas used to transfer and store NFT, typically 100k
  const minGasToTransfer = 100000;
  // Endpoint address of the chain being deployed on - https://layerzero.gitbook.io/docs/technical-reference/testnet/testnet-addresses
  // Fuji = 0x93f54D755A063cE7bB9e6Ac47Eccc8e33411d706
  // Mumbai = 0xf69186dfBa60DdB133E91E9A4B5673624293d8F8
  const lzEndpoint = "0xf69186dfBa60DdB133E91E9A4B5673624293d8F8";

  const onft721Reward = await ONFT721Reward.deploy(
    name,
    symbol,
    baseURI,
    minGasToTransfer,
    lzEndpoint,
  );

  const onft721Reward_receipt = await onft721Reward.deployTransaction.wait();
  onft721RewardAddress = onft721Reward.address;

  console.log(
    "ONFT721Reward deployed to:",
    onft721Reward.address,
    " on ",
    hre.network.name,
  );
  console.log(
    "ONFT721Reward Gas Fee:",
    onft721Reward_receipt.gasUsed.toString(),
  );
}

// function that runs the full deployment of all contracts
async function fullDeployment() {
  await deployONFT721Reward();

  console.log("");
  console.log("ONFT712Reward Contract deployment successful!");
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
