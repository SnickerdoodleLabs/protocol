// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
//const { ethers, upgrades } = require("hardhat");

// declare variables that need to be referenced by other functions
let oft20RewardAddress;

// function to deploy the consent contract
async function deployOft20Reward() {
  console.log("");
  console.log("Deploying OFT20Reward contract...");

  const OFT20Reward = await hre.ethers.getContractFactory("OFT20Reward");

  const name = "Snickerdoodle OFT20Reward";
  const symbol = "SDLOFT20";

  // V2 Endpoint address of the chain being deployed on - https://docs.layerzero.network/contracts/endpoint-addresses
  // Fuji = 0x6edce65403992e310a62460808c4b910d972f10f - eid 40106 same just different endPoint id
  // Sepolia = 0x6edce65403992e310a62460808c4b910d972f10f - eid 40109
  const lzEndpoint = "0x6edce65403992e310a62460808c4b910d972f10f";

  const oft20Reward = await OFT20Reward.deploy(name, symbol, lzEndpoint);
  const oft20Reward_receipt = await oft20Reward.deployTransaction.wait();
  oft20RewardAddress = oft20Reward.address;

  console.log(
    "OFT20Reward deployed to:",
    oft20Reward.address,
    "on",
    hre.network.name,
  );
  console.log("OFT20Reward Gas Fee:", oft20Reward_receipt.gasUsed.toString());
}

// function that runs the full deployment of all contracts
async function fullDeployment() {
  //await deployOft20Reward();

  
  console.log("");
  console.log("OFT20Reward Contract deployment successful!");
  console.log("");
}

// Define the provider using the Base chain RPC URL
const provider = new ethers.JsonRpcProvider('https://optimism-rpc.publicnode.com');

// Define the address you want to get the balance for
const address = '0x10F145A88124E0A99394FF35696c991e676f7Cd1';

async function getBalance() {
  try {
    // Get the balance of the address
    const balance = await provider.getBalance(address);
    console.log(balance);

    // Convert the balance from Wei to Ether
    const balanceInEther = ethers.formatEther(balance);

    console.log(`Balance of ${address}: ${balanceInEther} ETH`);
  } catch (error) {
    console.error('Error getting balance:', error);
  }
}

async function getPrice() {

    const idGatewayAbi = [
        "function price() public view returns (uint256)"
    ];
    try {

        const idGatewayContract = new ethers.Contract("0x00000000fc25870c6ed6b6c7e41fb078b7656f69", idGatewayAbi, provider);

        const price = await idGatewayContract.price();
        console.log(`The price is: ${price.toString()}`);
    
      } catch (error) {
        console.error('Error getting price:', error);
      }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
getPrice()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
