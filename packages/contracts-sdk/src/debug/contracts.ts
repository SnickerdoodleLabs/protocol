import { ICryptoUtils } from "@snickerdoodlelabs/node-utils";
import { ethers } from "ethers";

import {
  consentAddress,
  consentAddress2,
  consentAddress3,
  consentFactoryContractAddress,
} from "@contracts-sdk/debug/constants.js";
import { ConsentContract } from "@contracts-sdk/implementations/ConsentContract.js";
import { ConsentFactoryContract } from "@contracts-sdk/implementations/ConsentFactoryContract.js";
import { ERC20RewardContract } from "@contracts-sdk/implementations/ERC20RewardContract";
import NFR from "@contracts-sdk/interfaces/objects/abi/ConsentFactoryAbi.js";

export class Contracts {
  public constructor(
    protected signer: ethers.Wallet,
    protected signer1: ethers.Wallet,
    protected cryptoUtils: ICryptoUtils,
  ) {
    this.factoryContractPure = new ethers.Contract(
      consentFactoryContractAddress,
      NFR.abi,
      signer,
    );
    this.factoryContract = new ConsentFactoryContract(
      signer,
      consentFactoryContractAddress,
    );
    this.consentContract = new ConsentContract(
      signer,
      consentAddress,
      cryptoUtils,
    );
    this.consentContractNoPerms = new ConsentContract(
      signer1,
      consentAddress,
      cryptoUtils,
    );
    this.consentContract2 = new ConsentContract(
      signer,
      consentAddress2,
      cryptoUtils,
    );
    this.consentContract3 = new ConsentContract(
      signer,
      consentAddress3,
      cryptoUtils,
    );
  }
  public factoryContractPure: ethers.Contract;
  public factoryContract: ConsentFactoryContract;
  public consentContract: ConsentContract;
  public consentContractNoPerms: ConsentContract;
  public consentContract2: ConsentContract;
  public consentContract3: ConsentContract;
}
