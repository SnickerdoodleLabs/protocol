const fs = require("fs");

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

// define some dynamic imports
const consentFactory = function () {
  const hre = require("hardhat");
  if (hre.hardhatArguments.network == "dev") {
    return "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  } else if (hre.hardhatArguments.network == "hardhat") {
    return "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  } else if (hre.hardhatArguments.network == "rinkeby") {
    return "";
  } else if (hre.hardhatArguments.network == "mumbai") {
    return "";
  } else if (hre.hardhatArguments.network == "polygon") {
    return "";
  } else if (hre.hardhatArguments.network == "fuji") {
    return "";
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

// define some dynamic imports
const consentContract = function () {
  const hre = require("hardhat");
  if (hre.hardhatArguments.network == "dev") {
    return "0xCafac3dD18aC6c6e92c921884f9E4176737C052c";
  } else if (hre.hardhatArguments.network == "hardhat") {
    return "0xCafac3dD18aC6c6e92c921884f9E4176737C052c";
  } else if (hre.hardhatArguments.network == "mumbai") {
    return "";
  } else if (hre.hardhatArguments.network == "polygon") {
    return "";
  } else if (hre.hardhatArguments.network == "fuji") {
    return "";
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

// define some dynamic imports
const crumbsContract = function () {
  const hre = require("hardhat");
  if (hre.hardhatArguments.network == "dev") {
    return "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";
  } else if (hre.hardhatArguments.network == "hardhat") {
    return "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";
  } else if (hre.hardhatArguments.network == "mumbai") {
    return "";
  } else if (hre.hardhatArguments.network == "polygon") {
    return "";
  } else if (hre.hardhatArguments.network == "fuji") {
    return "";
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
  CC,
  CCFactory,
  consentFactory,
  consentContract,
  gasSettings,
  countryCode,
  CR,
  crumbsContract,
};
