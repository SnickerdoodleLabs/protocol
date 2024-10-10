import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ignition"; // Need both imports to support ethers based ignition

// To use viem, import below alone
// import "@nomicfoundation/hardhat-toolbox-viem";

import "./tasks/snickerdoodleWalletFactory";

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
    version: "0.8.24",
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
        // the current value is equal to keccak256('smart-wallet-example2')
        salt: "0xb74a48f0729221942ec42b31c524f5e6327a3b504805b99df7659c592b0271ed",
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
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
