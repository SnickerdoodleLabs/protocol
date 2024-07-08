import {
  ChainId,
  EVMContractAddress,
  EVMPrivateKey,
  URLString,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";

// #region export constants
/* export const chainId = ChainId(31337);
export const providerUrl = URLString("http://localhost:8545"); */

export const chainId = ChainId(10);
export const providerUrl = URLString("https://mainnet.optimism.io");

// This is the private key of the account that A. deployed the contracts and B. has all the token
// #0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
/* export const privateKey = EVMPrivateKey(
  "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
); */

// 0x0F9Deb936F279625C13b1d3E3ef8c94734cEd12c
export const privateKey = EVMPrivateKey(
  "46cb718f767d331ac76f04dc8771adf96f9ab21132545dd0c7797524684d0d63",
);

const wallet = new ethers.Wallet(privateKey);

// #0xfE3eEB4ba0FA4BD3b398711AF18908136f5bf430
export const privateKey1 = EVMPrivateKey(
  "87f0ccf57f9778b5b2e7b62ceddd9530dd6daa6efef6cd03c986d4cc48e2d62b",
);

// #0xF0CE81C1832B8eb87179Ee578c360b528BcFB3E8
export const privateKey2 = EVMPrivateKey(
  "360389bcb918034edc934cc7896a59b365a2c1769513e55e17974896e0b3a888",
);

export const consentFactoryContractAddress = EVMContractAddress(
  "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
);
export const consentAddress = EVMContractAddress(
  "0x5FbDB2315678afecb367f032d93F642f64180aa3",
);
export const consentAddress2 = EVMContractAddress(
  "0x8EFa1819Ff5B279077368d44B593a4543280e402",
);
export const consentAddress3 = EVMContractAddress(
  "0x6743E5c6E1B453372507E8dfD6CA53508721425B",
);
