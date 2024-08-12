import {
  BlockchainCommonErrors,
  EVMAccountAddress,
  FarcasterUserId,
  FarcasterIdRegistryContractError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { IBaseContract } from "@contracts-sdk/index.js";

export interface IFarcasterIdRegistryContract extends IBaseContract {
  /**
   * @notice Calls the idOf mapping in the registry contract
   *
   * @param ownerAddress Address to look up
   *
   * @return The farcaster id
   */
  idOf(
    ownerAddress: EVMAccountAddress,
  ): ResultAsync<
    FarcasterUserId | null,
    FarcasterIdRegistryContractError | BlockchainCommonErrors
  >;
}

export const IFarcasterIdRegistryContractType = Symbol.for(
  "IFarcasterIdRegistryContract",
);
