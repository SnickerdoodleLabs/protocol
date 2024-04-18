const fs = require("fs");

const logTXDetails = (txrct) => {
  console.log("----TX Mined---");
  console.log("Blocknumber:", txrct.blockNumber);
  console.log("TX Hash:", txrct.transactionHash);
  console.log("Gas Used:", txrct.gasUsed.toString());
};

const BEACON = function () {
  const artifactPath =
    "./artifacts/@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol/UpgradeableBeacon.json";
  if (fs.existsSync(artifactPath)) {
    return require("../" + artifactPath);
  } else {
    return null;
  }
};

// dynamic artifact imports to prevent error when contracts are not compiled
const CC = function () {
  const artifactPath = "./artifacts/contracts/consent/Consent.sol/Consent.json";
  if (fs.existsSync(artifactPath)) {
    return require("../" + artifactPath);
  } else {
    return null;
  }
};

const CCFactory = function () {
  const artifactPath =
    "./artifacts/contracts/consent/ConsentFactory.sol/ConsentFactory.json";
  if (fs.existsSync(artifactPath)) {
    return require("../" + artifactPath);
  } else {
    return null;
  }
};

const CR = function () {
  const artifactPath = "./artifacts/contracts/registry/Crumbs.sol/Crumbs.json";
  if (fs.existsSync(artifactPath)) {
    return require("../" + artifactPath);
  } else {
    return null;
  }
};

const SIFT = function () {
  const artifactPath = "./artifacts/contracts/registry/Sift.sol/Sift.json";
  if (fs.existsSync(artifactPath)) {
    return require("../" + artifactPath);
  } else {
    return null;
  }
};

const REWARD = function () {
  const artifactPath = "./artifacts/contracts/testing/Reward.sol/Reward.json";
  if (fs.existsSync(artifactPath)) {
    return require("../" + artifactPath);
  } else {
    return null;
  }
};

// dynamic artifact imports to prevent error when contracts are not compiled
const OFT20REWARD = function () {
  const artifactPath =
    "./artifacts/contracts/testing/OFT20Reward.sol/OFT20Reward.json";
  if (fs.existsSync(artifactPath)) {
    return require("../" + artifactPath);
  } else {
    return null;
  }
};

// dynamic artifact imports to prevent error when contracts are not compiled
const ONFT721REWARD = function () {
  const artifactPath =
    "./artifacts/contracts/testing/ONFT721Reward.sol/ONFT721Reward.json";
  if (fs.existsSync(artifactPath)) {
    return require("../" + artifactPath);
  } else {
    return null;
  }
};

const gasSettings = async function (txCount) {
  const hre = require("hardhat");
  const [account] = await hre.ethers.getSigners();
  const feeData = await account.getFeeData();
  let gs;
  if (txCount) {
    gs = {
      nonce: txCount,
      maxFeePerGas: feeData.maxFeePerGas,
    };
  } else {
    gs = {
      maxFeePerGas: feeData.maxFeePerGas,
    };
  }
  return gs;
};

// returns deployment address of the Consent Contract Beacon Contract
const consentBeacon = function () {
  const hre = require("hardhat");
  if (hre.hardhatArguments.network == "dev") {
    return "";
  } else if (hre.hardhatArguments.network == "localhost") {
    return "";
  } else if (hre.hardhatArguments.network == "doodle") {
    return "";
  } else if (hre.hardhatArguments.network == "hardhat") {
    return "";
  } else if (hre.hardhatArguments.network == "rinkeby") {
    return "";
  } else if (hre.hardhatArguments.network == "mumbai") {
    return "";
  } else if (hre.hardhatArguments.network == "polygon") {
    return "";
  } else if (hre.hardhatArguments.network == "fuji") {
    return "0xaF5Df6017f28486647b1B621412cCf556E2c5860";
  } else if (hre.hardhatArguments.network == "avalanche") {
    return "";
  } else if (hre.hardhatArguments.network == "fantom") {
    return "";
  } else if (hre.hardhatArguments.network == "mainnet") {
    return "";
  } else if (hre.hardhatArguments.network == "gnosis") {
    return "";
  } else if (hre.hardhatArguments.network == "binance") {
    return "";
  } else if (hre.hardhatArguments.network == "moonbeam") {
    return "";
  } else if (hre.hardhatArguments.network == "arbitrum") {
    return "";
  } else if (hre.hardhatArguments.network == "optimism") {
    return "";
  } else if (hre.hardhatArguments.network == "astar") {
    return "";
  } else if (hre.hardhatArguments.network == "sui") {
    return "";
  } else {
    return "";
  }
};

// returns deployment address of the Consent Contract Factory
const consentFactory = function () {
  const hre = require("hardhat");
  if (hre.hardhatArguments.network == "dev") {
    return "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
  } else if (hre.hardhatArguments.network == "localhost") {
    return "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
  } else if (hre.hardhatArguments.network == "doodle") {
    return "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
  } else if (hre.hardhatArguments.network == "hardhat") {
    return "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
  } else if (hre.hardhatArguments.network == "rinkeby") {
    return "";
  } else if (hre.hardhatArguments.network == "mumbai") {
    return "";
  } else if (hre.hardhatArguments.network == "polygon") {
    return "";
  } else if (hre.hardhatArguments.network == "fuji") {
    return "0x5540122e78241679Da8d07A04A74D3a7f52aED97";
  } else if (hre.hardhatArguments.network == "avalanche") {
    return "";
  } else if (hre.hardhatArguments.network == "fantom") {
    return "";
  } else if (hre.hardhatArguments.network == "mainnet") {
    return "";
  } else if (hre.hardhatArguments.network == "gnosis") {
    return "";
  } else if (hre.hardhatArguments.network == "binance") {
    return "";
  } else if (hre.hardhatArguments.network == "moonbeam") {
    return "";
  } else if (hre.hardhatArguments.network == "arbitrum") {
    return "";
  } else if (hre.hardhatArguments.network == "optimism") {
    return "";
  } else if (hre.hardhatArguments.network == "astar") {
    return "";
  } else if (hre.hardhatArguments.network == "sui") {
    return "";
  } else {
    return "";
  }
};

// might remove this function
const countryCode = function () {
  var data = fs.readFileSync("./tasks/iso_3166_country_codes.csv", "utf8");
  data = data.split("\r\n");
  let countryCode = {};
  for (let i = 0; i < data.length; i++) {
    const [country, code] = data[i].split(",");
    countryCode[country] = parseInt(code);
  }
  return countryCode;
};

module.exports = {
  logTXDetails,
  BEACON,
  CC,
  CCFactory,
  CR,
  SIFT,
  consentBeacon,
  consentFactory,
  gasSettings,
  countryCode,
  crumbsContract,
  siftContract,
  REWARD,
  OFT20REWARD,
  ONFT721REWARD,
};
