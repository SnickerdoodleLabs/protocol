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
  BlockchainCommonErrors,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

export interface IMinimalForwarderContract extends IBaseContract {
  getNonce(
    from: EVMAccountAddress,
  ): ResultAsync<
    BigNumberString,
    MinimalForwarderContractError | BlockchainCommonErrors
  >;

  verify(
    request: IMinimalForwarderRequest,
    signature: Signature,
  ): ResultAsync<
    boolean,
    MinimalForwarderContractError | BlockchainCommonErrors
  >;

  execute(
    request: IMinimalForwarderRequest,
    signature: Signature,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | MinimalForwarderContractError
  >;
}

export const IMinimalForwarderContractType = Symbol.for(
  "IMinimalForwarderContract",
);
