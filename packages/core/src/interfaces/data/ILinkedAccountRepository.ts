import {
  LinkedAccount,
  PersistenceError,
  AccountAddress,
  Invitation,
  EVMContractAddress,
  EarnedReward,
  BlockNumber,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ILinkedAccountRepository {
  /**
   * This method adds an account to the data wallet. Only these accounts may unlock the
   * wallet.
   * @param linkedAccount
   */
  addAccount(linkedAccount: LinkedAccount): ResultAsync<void, PersistenceError>;

  /**
   * This method removes an ethereum account from the data wallet.
   * @param accountAddress
   */
  removeAccount(
    accountAddress: AccountAddress,
  ): ResultAsync<void, PersistenceError>;

  /**
   * This method returns all the Ethereum accounts that are registered in the data wallet.
   */
  getAccounts(): ResultAsync<LinkedAccount[], PersistenceError>;

  /**
   * Returns the list of consent contracts that the user has opted in to.
   */
  getAcceptedInvitations(): ResultAsync<Invitation[], PersistenceError>;

  /**
   * Adds a list of addresses from the list of addresses the user has opted in to.
   * IMPORTANT: This does not actually opt them in, it just persists the fact
   * @param addressesToAdd
   */
  addAcceptedInvitations(
    infoToAdd: Invitation[],
  ): ResultAsync<void, PersistenceError>;

  /**
   * Removes a list of addresses from the list of addresses the user has opted in to.
   * IMPORTANT: This does not actually opt them out, it just records the opt-out
   * @param addressesToRemove
   */
  removeAcceptedInvitationsByContractAddress(
    addressesToRemove: EVMContractAddress[],
  ): ResultAsync<void, PersistenceError>;

  addEarnedRewards(
    rewards: EarnedReward[],
  ): ResultAsync<void, PersistenceError>;
  getEarnedRewards(): ResultAsync<EarnedReward[], PersistenceError>;

  setDefaultReceivingAddress(
    receivingAddress: AccountAddress | null,
  ): ResultAsync<void, PersistenceError>;
  getDefaultReceivingAddress(): ResultAsync<
    AccountAddress | null,
    PersistenceError
  >;
  setReceivingAddress(
    contractAddress: EVMContractAddress,
    receivingAddress: AccountAddress | null,
  ): ResultAsync<void, PersistenceError>;
  getReceivingAddress(
    contractAddress: EVMContractAddress,
  ): ResultAsync<AccountAddress | null, PersistenceError>;

  /**
   * Returns a list of consent contract addresses that the user has rejected
   */
  getRejectedCohorts(): ResultAsync<EVMContractAddress[], PersistenceError>;

  /**
   * Adds a list of consent contract addresses to the list of cohorts the user has
   * positively marked as rejected
   */
  addRejectedCohorts(
    consentContractAddresses: EVMContractAddress[],
  ): ResultAsync<void, PersistenceError>;
}

export const ILinkedAccountRepositoryType = Symbol.for(
  "ILinkedAccountRepository",
);
