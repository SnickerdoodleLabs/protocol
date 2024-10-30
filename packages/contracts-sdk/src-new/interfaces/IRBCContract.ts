import {
  BlockchainCommonErrors,
  EVMAccountAddress,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { ERewardRoles } from "@contracts-sdk/interfaces/enums";
import { IBaseContract } from "@contracts-sdk/interfaces/IBaseContract.js";
import {
  ContractOverrides,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/objects/index.js";

// Interface for Role Based contract
export interface IRBCContract<T> extends IBaseContract {
  /**
   * Checks if an address has a specific role in the Reward contract
   * @param role string that is a key defined in RewardRoles enum
   * @param address Address to use
   */
  hasRole(
    role: keyof typeof ERewardRoles,
    address: EVMAccountAddress,
  ): ResultAsync<boolean, BlockchainCommonErrors | T>;

  /**
   * Grants a role to an address
   * @param role string that is a key defined in RewardRoles enum
   * @param address Address to use
   */
  grantRole(
    role: keyof typeof ERewardRoles,
    address: EVMAccountAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, BlockchainCommonErrors | T>;

  /**
   * Revokes a role of an address
   * @param role string that is a key defined in RewardRoles enum
   * @param address Address to use
   */
  revokeRole(
    role: keyof typeof ERewardRoles,
    address: EVMAccountAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, BlockchainCommonErrors | T>;

  /**
   * Allows an address to renounce its role
   * @param role string that is a key defined in RewardRoles enum
   * @param address Address to use
   */
  renounceRole(
    role: keyof typeof ERewardRoles,
    address: EVMAccountAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, BlockchainCommonErrors | T>;
}
