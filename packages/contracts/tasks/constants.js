const fs = require("fs");

const logTXDetails = (txrct) => {
  console.log("----TX Mined---");
  console.log("Blocknumber:", txrct.blockNumber);
  console.log("TX Hash:", txrct.transactionHash);
  console.log("Gas Used:", txrct.gasUsed.toString());
};

const BEACON = function () {
  const artifactPath = "./artifacts/\@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol/UpgradeableBeacon.json";
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
  } else {
    return "";
  }
};

// returns deployment address of the Consent Contract Factory
const consentFactory = function () {
  const hre = require("hardhat");
  if (hre.hardhatArguments.network == "dev") {
    return "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  } else if (hre.hardhatArguments.network == "localhost") {
    return "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  } else if (hre.hardhatArguments.network == "doodle") {
    return "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  } else if (hre.hardhatArguments.network == "hardhat") {
    return "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  } else if (hre.hardhatArguments.network == "rinkeby") {
    return "";
  } else if (hre.hardhatArguments.network == "mumbai") {
    return "";
  } else if (hre.hardhatArguments.network == "polygon") {
    return "";
  } else if (hre.hardhatArguments.network == "fuji") {
    return "0xC44C9B4375ab43D7974252c37bccb41F99910fA5";
  } else if (hre.hardhatArguments.network == "avalanche") {
    return "";
  } else if (hre.hardhatArguments.network == "fantom") {
    return "";
  } else if (hre.hardhatArguments.network == "mainnet") {
    return "";
  } else {
    return "";
  }
};

// returns the deployment address of the Crumbs Contract
const crumbsContract = function () {
  const hre = require("hardhat");
  if (hre.hardhatArguments.network == "dev") {
    return "0x0165878A594ca255338adfa4d48449f69242Eb8F";
  } else if (hre.hardhatArguments.network == "doodle") {
    return "0x0165878A594ca255338adfa4d48449f69242Eb8F";
  } else if (hre.hardhatArguments.network == "localhost") {
    return "0x0165878A594ca255338adfa4d48449f69242Eb8F";
  } else if (hre.hardhatArguments.network == "hardhat") {
    return "0x0165878A594ca255338adfa4d48449f69242Eb8F";
  } else if (hre.hardhatArguments.network == "mumbai") {
    return "";
  } else if (hre.hardhatArguments.network == "polygon") {
    return "";
  } else if (hre.hardhatArguments.network == "fuji") {
    return "0x97464F3547510fb430448F5216eC7D8e71D7C4eF";
  } else if (hre.hardhatArguments.network == "avalanche") {
    return "";
  } else if (hre.hardhatArguments.network == "fantom") {
    return "";
  } else if (hre.hardhatArguments.network == "mainnet") {
    return "";
  } else {
    return "";
  }
};

// returns the deployment address of the Sift Contract used for the
// Scam Filter feature of the Data Wallet
const siftContract = function () {
  const hre = require("hardhat");
  if (hre.hardhatArguments.network == "dev") {
    return "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";
  } else if (hre.hardhatArguments.network == "localhost") {
    return "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";
  } else if (hre.hardhatArguments.network == "doodle") {
    return "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";
  } else if (hre.hardhatArguments.network == "hardhat") {
    return "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";
  } else if (hre.hardhatArguments.network == "mumbai") {
    return "";
  } else if (hre.hardhatArguments.network == "polygon") {
    return "";
  } else if (hre.hardhatArguments.network == "fuji") {
    return "0x82721EB9786255fA45BFf58c82Bc7Ae4210B9c72";
  } else if (hre.hardhatArguments.network == "avalanche") {
    return "";
  } else if (hre.hardhatArguments.network == "fantom") {
    return "";
  } else if (hre.hardhatArguments.network == "mainnet") {
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
};
