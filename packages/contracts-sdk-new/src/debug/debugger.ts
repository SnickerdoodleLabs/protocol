import "reflect-metadata";
import { CryptoUtils } from "@snickerdoodlelabs/node-utils";
import {
  BaseURI,
  BigNumberString,
  Commitment,
  DomainName,
  EVMAccountAddress,
  EVMContractAddress,
  MarketplaceTag,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { ResultUtils } from "neverthrow-result-utils";

import {
  privateKey,
  privateKey1,
  privateKey2,
  providerUrl,
} from "@contracts-sdk/debug/constants.js";
import { Contracts } from "@contracts-sdk/debug/contracts.js";
import { ERC20RewardContract } from "@contracts-sdk/implementations/ERC20RewardContract.js";
import {
  ContractOverrides,
} from "@contracts-sdk/interfaces/index.js";

console.log("providerUrl", providerUrl);

const cryptoUtils = new CryptoUtils();

// provider and signer
const provider = new ethers.JsonRpcProvider(providerUrl);
const signer = new ethers.Wallet(privateKey, provider);

const signer1 = new ethers.Wallet(privateKey1, provider);

console.log("signer.address", signer.address);
console.log("signer1.address", signer1.address);

// Initializing contracts
const contracts = new Contracts(signer, signer1, cryptoUtils);

const getLatestBlock = async () => {
  try {
    const latest = await provider.getBlock("latest");
    console.log("Latest block: ", latest);
  } catch (e) {
    console.log("getLatestBlock error: ", e);
  }
};

const sendFunds = async () => {
  const tx = {
    to: signer1.address,
    value: ethers.parseEther((100).toString()),
  };
  try {
    const transaction = await signer.sendTransaction(tx);
    console.log("sendFunds transaction: ", transaction);
  } catch (e) {
    console.error("sendFunds error: ", e);
  }
};

const getAccountBalanceForErc20 = async (
  contract: EVMContractAddress,
  account: EVMAccountAddress,
) => {
  try {
    const erc20Contract = new ERC20RewardContract(signer, contract);
    erc20Contract.balanceOf(account).then((balance) => {
      console.log("balance: ", balance);
    });
  } catch (e) {
    console.log("getAccountBalances e: ", e);
  }
};

const init = async () => {
  console.log("Initializing...");
  await getLatestBlock();
  // await sendFunds();
  await getAccountBalanceForErc20(
    EVMContractAddress("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"),
    EVMAccountAddress("0x0F9Deb936F279625C13b1d3E3ef8c94734cEd12c"),
  );
};

await init();
