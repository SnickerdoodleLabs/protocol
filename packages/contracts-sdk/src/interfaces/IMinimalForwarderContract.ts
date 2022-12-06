import {
  EVMAccountAddress,
  MinimalForwarderContractError,
  BigNumberString,
  Signature,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

import { IMinimalForwarderRequest } from "@contracts-sdk/interfaces/objects";

export interface IMinimalForwarderContract {
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

  getContract(): ethers.Contract;
}

export const IMinimalForwarderContractType = Symbol.for(
  "IMinimalForwarderContract",
);
