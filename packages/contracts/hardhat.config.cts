import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-gas-reporter";
import "hardhat-contract-sizer";

require("dotenv").config();

// Remote RPC URL
const urlOverride = process.env.ETH_PROVIDER_URL;

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
        runs: 500,
      },
    },
  },
  networks: {
    localhost: {
      accounts: accounts,
      chainId: 31337,
      url: "http://localhost:8545",
      gas: 6000000,
      gasPrice: 8000000000,
      /* gas: 30000000, // to mimic a full block gas limit locally
      gasPrice: 30000000000, // to mimic fuji gas price locally */
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    token: "AVAX",
    gasPriceApi:
      "https://api.snowtrace.io/api?module=proxy&action=eth_gasPrice",
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
  },
};

export default config;
