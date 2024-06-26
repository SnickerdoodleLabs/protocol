import {
  BlockchainCommonErrors,
  EVMAccountAddress,
  EVMContractAddress,
  FarcasterUserId,
  FarcasterIdRegistryContractError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { IBaseContract } from "../IBaseContract";

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
    FarcasterUserId | null,
    FarcasterIdRegistryContractError | BlockchainCommonErrors
  >;
}
