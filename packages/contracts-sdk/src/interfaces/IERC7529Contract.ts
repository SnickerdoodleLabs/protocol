import { BlockchainCommonErrors, DomainName } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { IBaseContract } from "@contracts-sdk/interfaces/IBaseContract.js";
import {
  ContractOverrides,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/objects/index.js";

export interface IERC7529Contract<T> extends IBaseContract {
  /**
   * Adds a domain to the contract storage
   * Only callable by address with DEFAULT_ADMIN_ROLE
   * If domain already exists, reverts with error message "Reward : Domain already added"
   * @param domain Domain name
   */
  addDomain(
    domain: DomainName,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, BlockchainCommonErrors | T>;

  /**
   * Removes a domain from the contract storage
   * Only callable by address with DEFAULT_ADMIN_ROLE
   * If domain does not exist, reverts with error message "Reward : Domain is not in the list"
   * @param domain Domain name
   */
  removeDomain(
    domain: DomainName,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, BlockchainCommonErrors | T>;

  /**
   * Returns an array of domains added to the contract
   */
  getDomains(): ResultAsync<DomainName[], BlockchainCommonErrors | T>;
}
