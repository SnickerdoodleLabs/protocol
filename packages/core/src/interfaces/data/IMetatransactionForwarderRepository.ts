import {
  BigNumberString,
  BlockchainProviderError,
  EVMAccountAddress,
  EVMPrivateKey,
  MinimalForwarderContractError,
  Signature,
  BlockchainCommonErrors,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { MetatransactionRequest } from "@core/interfaces/objects/index.js";

export interface IMetatransactionForwarderRepository {
  /**
   * Returns the current forwarder nonce for the requested account address. Defaults to the data wallet.
   * @param accountAddress Optional, defaults to the data wallet address
   */
  getNonce(
    accountAddress?: EVMAccountAddress,
  ): ResultAsync<
    BigNumberString,
    | BlockchainProviderError
    | UninitializedError
    | MinimalForwarderContractError
    | BlockchainCommonErrors
  >;

  signMetatransactionRequest(
    request: MetatransactionRequest,
    signingKey: EVMPrivateKey,
  ): ResultAsync<Signature, UninitializedError>;
}
export const IMetatransactionForwarderRepositoryType = Symbol.for(
  "IMetatransactionForwarderRepository",
);
