require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");
require("hardhat-gas-reporter");
require("hardhat-tracer");
require("ethers");
require("solidity-coverage");
//require('hardhat-docgen');
require("solidity-docgen");
require("./tasks/general.js");
require("./tasks/ipfs.js");
require("./tasks/queries.js");
require("./tasks/consent.js");
require("./tasks/crumbs.js");
require("./tasks/utils.js");
require("./tasks/sift.js");

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

// we want to use a different chain id locally vs remotely
const chainid = (process.env.NETWORK === 'local') ? 31338 : 31337;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: chainid,
      mining: {
        auto: true,
        interval: 5000,
      },
    },
    local: {
      accounts: accounts,
      chainId: 31338,
      url: "http://127.0.0.1:8569",
      gas: 6000000,
      gasPrice: 8000000000,
    },
    dev: {
      accounts: accounts,
      chainId: 31337,
      url: "http://127.0.0.1:8569",
      gas: 6000000,
      gasPrice: 8000000000,
    },
    subnet: {
      accounts: accounts,
      chainId: 36,
      url: "http://127.0.0.1:9650/ext/bc/5o2XBwQGRWwrnM3KQoXSbpztjJJdnbN73MtD7nHtxFgZ77ict/rpc",
    },
    mainnet: {
      // ethereum mainnet
      accounts: accounts,
      chainId: 1,
      url: urlOverride || "http://127.0.0.1:8549",
    },
    rinkeby: {
      // ethereum testnet
      accounts: accounts,
      chainId: 4,
      url: urlOverride || "http://127.0.0.1:8549",
    },
    mumbai: {
      // polygon testnet
      accounts: accounts,
      chainId: 80001,
      url: urlOverride || "http://127.0.0.1:8549",
      gas: 6000000,
      gasPrice: 8000000000,
    },
    polygon: {
      // polygon mainnet
      accounts: accounts,
      chainId: 137,
      url: urlOverride || "http://127.0.0.1:8549",
    },
    fuji: {
      // avalanche testnet
      accounts: accounts,
      chainId: 43113,
      url: urlOverride || "https://api.avax-test.network/ext/bc/C/rpc",
    },
    avalanche: {
      // avalanche mainnet
      accounts: accounts,
      chainId: 43114,
      url: urlOverride || "http://127.0.0.1:8549",
    },
    fantom: {
      // fantom mainnet
      accounts: accounts,
      chainId: 250,
      url: urlOverride || "http://127.0.0.1:8549",
    },
  },
  gasReporter: {
    enabled: true,
  },
  docgen: {
    path: "./docs",
    clear: true,
    runOnCompile: true,
    pages: "files",
  },
};
