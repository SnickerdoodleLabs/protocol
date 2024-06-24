import {
  BlockchainCommonErrors,
  EVMAccountAddress,
  EVMContractAddress,
  FarcasterKeyGatewayContractError,
  Signature,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { IBaseContract } from "../IBaseContract";

import {
  ContractOverrides,
  WrappedTransactionResponse,
} from "@contracts-sdk/index";

export interface IFarcasterKeyGatewayContract extends IBaseContract {
  /**
   * @notice Add a key associated with the caller's fid, setting the key state to ADDED.
   *
   * @param key          Bytes of the key to add.
   * @param metadata     Metadata about the key, which is not stored and only emitted in an event.
   */
  add(
    key: string,
    metadata: string,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    FarcasterKeyGatewayContractError | BlockchainCommonErrors
  >;
}
