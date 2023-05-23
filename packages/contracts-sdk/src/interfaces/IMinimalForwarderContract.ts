import {
  EVMAccountAddress,
  MinimalForwarderContractError,
  BigNumberString,
  Signature,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

import { IBaseContract } from "@contracts-sdk/interfaces/IBaseContract.js";
import { IMinimalForwarderRequest } from "@contracts-sdk/interfaces/objects/index.js";

export interface IMinimalForwarderContract extends IBaseContract {
  getNonce(
    from: EVMAccountAddress,
  ): ResultAsync<BigNumberString, MinimalForwarderContractError>;

  verify(
    request: IMinimalForwarderRequest,
    signature: Signature,
  ): ResultAsync<boolean, MinimalForwarderContractError>;

  execute(
    request: IMinimalForwarderRequest,
    signature: Signature,
  ): ResultAsync<
    ethers.providers.TransactionResponse,
    MinimalForwarderContractError
  >;
}

export const IMinimalForwarderContractType = Symbol.for(
  "IMinimalForwarderContract",
);
