import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ignition"; // Need both imports to support ethers based ignition
import "@openzeppelin/hardhat-upgrades";
import "hardhat-contract-sizer";

// To use viem, import below alone
// import "@nomicfoundation/hardhat-toolbox-viem";

import "./tasks/snickerdoodleFactory";

require("dotenv").config();

// seed phrase for your HD wallet
const mnemonic =
  process.env.MNEMONIC ||
  "test test test test test test test test test test test junk";

// alternative to mnemonic, set a specific private key
const key = process.env.ETH_PRIVATE_KEY;

// if no private key is found in .env, use the public known mnemonic
const accounts = key ? [key] : { mnemonic };

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  ignition: {
    strategyConfig: {
      create2: {
        // To learn more about salts, see the CreateX documentation
        // the current value is equal to keccak256('smart-wallet-example7')
        salt: "0x15d6420d879f014c80398adfd9ed46968a82f49cf3d8b055c89dfb6232f8f371",
      },
    },
  },
  networks: {
    fuji: {
      url: "https://rpc.ankr.com/avalanche_fuji",
      accounts: accounts,
    },
    sepolia: {
      url: "https://rpc.ankr.com/eth_sepolia",
      accounts: accounts,
    },
    amoy: {
      url: "https://rpc.ankr.com/polygon_amoy",
      accounts: accounts,
    },
    basesepolia: {
      url: "https://base-sepolia-rpc.publicnode.com	",
      accounts: accounts,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  contractSizer: {
    runOnCompile: true, // Optional: Run contract sizing automatically on compile
  },
};

export default config;
