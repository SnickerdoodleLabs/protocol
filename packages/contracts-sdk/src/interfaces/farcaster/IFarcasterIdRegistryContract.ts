import {
  BlockchainCommonErrors,
  EVMAccountAddress,
  FarcasterUserId,
  FarcasterIdRegistryContractError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { IFarcasterBaseContract } from "@contracts-sdk/interfaces/farcaster/IFarcasterBaseContract.js";

export interface IFarcasterIdRegistryContract
  extends IFarcasterBaseContract<FarcasterIdRegistryContractError> {
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
