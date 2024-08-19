import { ICryptoUtils } from "@snickerdoodlelabs/node-utils";
import { ethers } from "ethers";

import {} from "@contracts-sdk/debug/constants.js";

export class Contracts {
  public constructor(
    protected signer: ethers.Wallet,
    protected signer1: ethers.Wallet,
    protected cryptoUtils: ICryptoUtils,
  ) {}
}
