import {
  LinkedAccount,
  PersistenceError,
  AccountAddress,
  EVMContractAddress,
  EarnedReward,
  EChain,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ILinkedAccountRepository {
  /**
   * This method adds an account to the data wallet. These accounts are tracked
   * by the data wallet and the indexers
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

  getLinkedAccount(
    accountAddress: AccountAddress,
    chain: EChain,
  ): ResultAsync<LinkedAccount | null, PersistenceError>;

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
}

export const ILinkedAccountRepositoryType = Symbol.for(
  "ILinkedAccountRepository",
);
