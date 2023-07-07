import { IBaseContract } from "@contracts-sdk/interfaces/IBaseContract.js";
import {
  ContractOverrides,
  IMinimalForwarderRequest,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/objects";
import {
  EVMAccountAddress,
  MinimalForwarderContractError,
  BigNumberString,
  Signature,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

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
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, MinimalForwarderContractError>;
}

export const IMinimalForwarderContractType = Symbol.for(
  "IMinimalForwarderContract",
);
