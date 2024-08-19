import {
  ChainId,
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
