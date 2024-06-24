import {
  BlockchainCommonErrors,
  EVMAccountAddress,
  EVMContractAddress,
  FarcasterId,
  FarcasterIdGatewayContractError,
  FarcasterIdRegistryContractError,
  Signature,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { IBaseContract } from "../IBaseContract";

import {
  ContractOverrides,
  WrappedTransactionResponse,
} from "@contracts-sdk/index";

export interface IFarcasterIdRegistryContract extends IBaseContract {
  /**
   * @notice Calls the idOf mapping in the registry contract
   *
   * @param ownerAddress Address to look up
   *
   * @return The farcaster id
   */
  idOf(
    ownerAddress: EVMAccountAddress | EVMContractAddress,
  ): ResultAsync<
    FarcasterId,
    FarcasterIdRegistryContractError | BlockchainCommonErrors
  >;
}
