import {
  ChainId,
  EVMContractAddress,
  EVMPrivateKey,
  URLString,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";

// #region export constants
export const chainId = ChainId(31337);
export const providerUrl = URLString("http://localhost:8545");

// This is the private key of the account that A. deployed the contracts and B. has all the token
// #0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
export const privateKey = EVMPrivateKey(
  "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
);

// #0xfE3eEB4ba0FA4BD3b398711AF18908136f5bf430
export const privateKey1 = EVMPrivateKey(
  "87f0ccf57f9778b5b2e7b62ceddd9530dd6daa6efef6cd03c986d4cc48e2d62b",
);

// #0xF0CE81C1832B8eb87179Ee578c360b528BcFB3E8
export const privateKey2 = EVMPrivateKey(
  "360389bcb918034edc934cc7896a59b365a2c1769513e55e17974896e0b3a888",
);

export const consentFactoryContractAddress = EVMContractAddress(
  "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
);
export const crumbsContractAddress = EVMContractAddress(
  "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e",
);
export const metatransactionForwarderContractAddress = EVMContractAddress(
  "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
);
export const siftContractAddress = EVMContractAddress(
  "0x352EC444f0D2C09ad72eE3735341b45e577FCAE8",
);
export const consentAddress = EVMContractAddress(
  "0x23dB4a08f2272df049a4932a4Cc3A6Dc1002B33E",
);
export const consentAddress2 = EVMContractAddress(
  "0x8EFa1819Ff5B279077368d44B593a4543280e402",
);
export const consentAddress3 = EVMContractAddress(
  "0x6743E5c6E1B453372507E8dfD6CA53508721425B",
);

export const sampleAgreementFlag1 = ethers.encodeBytes32String("1");
