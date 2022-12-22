import { ResultAsync } from "neverthrow";

import {
  ClickData,
  EarnedReward,
  TransactionFilter,
  TokenBalance,
  Invitation,
  LinkedAccount,
  SiteVisit,
  ChainTransaction,
  WalletNFT,
  TokenAddress,
  ITransactionPaymentCounter,
} from "@objects/businessObjects";
import { AjaxError, PersistenceError } from "@objects/errors";
import { IDataWalletBackup } from "@objects/interfaces/IDataWalletBackup";
import {
  Age,
  EmailAddressString,
  ChainId,
  EVMContractAddress,
  EVMPrivateKey,
  GivenName,
  Gender,
  FamilyName,
  CountryCode,
  URLString,
  BlockNumber,
  UnixTimestamp,
  AccountAddress,
  CeramicStreamID,
  DataWalletBackupID,
} from "@objects/primitives";

/**
 * This is technically a repository, but since the form factor may need to override where
 * data is put, we hoist it into the objects package.
 * Hopefully, we can just have a single implementation of this that uses perhaps Ceramic
 * and/or IPFS to hold all the data, but in the meantime, we may need local storage versions.
 *
 *
 */
export interface IDataWalletPersistence {
  /**
   * This method is called on the IDataWalletPersistence after the data wallet's derived
   * key is determined. All other methods should not return UNTIL after unlock is complete.
   * This means that if I call addAccount() before unlock(), addAccount() should not resolve,
   * indefinately. Once unlock() is complete, the outstanding call to addAccount() can continue.
   * This is trivially implemented internally by maintaining a consistent unlocked ResultAsync,
   * and using "return this.unlocked.andThen()" at the beginning of the other methods.
   * @param derivedKey
   */
  unlock(derivedKey: EVMPrivateKey): ResultAsync<void, PersistenceError>;

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

  /**
   * This is an example method for adding data to the wallet. In this case, it would be a "click",
   * presumeably captured by the Form Factor.
   */
  addClick(click: ClickData): ResultAsync<void, PersistenceError>;

  /** This returns you click data that you have stored, according to the filter */
  getClicks(): ResultAsync<ClickData[], PersistenceError>;

  /** Google User Information */
  setAge(age: Age): ResultAsync<void, PersistenceError>;
  getAge(): ResultAsync<Age | null, PersistenceError>;

  setGivenName(name: GivenName): ResultAsync<void, PersistenceError>;
  getGivenName(): ResultAsync<GivenName | null, PersistenceError>;

  setFamilyName(name: FamilyName): ResultAsync<void, PersistenceError>;
  getFamilyName(): ResultAsync<FamilyName | null, PersistenceError>;

  setBirthday(birthday: UnixTimestamp): ResultAsync<void, PersistenceError>;
  getBirthday(): ResultAsync<UnixTimestamp | null, PersistenceError>;

  setGender(gender: Gender): ResultAsync<void, PersistenceError>;
  getGender(): ResultAsync<Gender | null, PersistenceError>;

  setEmail(email: EmailAddressString): ResultAsync<void, PersistenceError>;
  getEmail(): ResultAsync<EmailAddressString | null, PersistenceError>;

  setLocation(location: CountryCode): ResultAsync<void, PersistenceError>;
  getLocation(): ResultAsync<CountryCode | null, PersistenceError>;

  addEarnedRewards(
    rewards: EarnedReward[],
  ): ResultAsync<void, PersistenceError>;
  getEarnedRewards(): ResultAsync<EarnedReward[], PersistenceError>;

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

  addSiteVisits(siteVisits: SiteVisit[]): ResultAsync<void, PersistenceError>;
  getSiteVisits(): ResultAsync<SiteVisit[], PersistenceError>;

  // return a map of URLs
  getSiteVisitsMap(): ResultAsync<Map<URLString, number>, PersistenceError>;

  // return an array of Chain Transaction
  // getTransactionsMap(): ResultAsync<Array<IChainTransaction>, PersistenceError>;

  getTransactionValueByChain(): ResultAsync<
    ITransactionPaymentCounter[],
    PersistenceError
  >;

  getLatestTransactionForAccount(
    chainId: ChainId,
    address: AccountAddress,
  ): ResultAsync<ChainTransaction | null, PersistenceError>;
  addTransactions(
    transactions: ChainTransaction[],
  ): ResultAsync<void, PersistenceError>;
  getTransactions(
    filter?: TransactionFilter,
  ): ResultAsync<ChainTransaction[], PersistenceError>;

  getAccountBalances(
    chains?: ChainId[],
    accounts?: LinkedAccount[],
  ): ResultAsync<TokenBalance[], PersistenceError>;
  getAccountNFTs(
    chains?: ChainId[],
    accounts?: LinkedAccount[],
  ): ResultAsync<WalletNFT[], PersistenceError>;

  setLatestBlockNumber(
    contractAddress: EVMContractAddress,
    blockNumber: BlockNumber,
  ): ResultAsync<void, PersistenceError>;
  getLatestBlockNumber(
    contractAddress: EVMContractAddress,
  ): ResultAsync<BlockNumber, PersistenceError>;

  getTokenPrice(
    chainId: ChainId,
    address: TokenAddress | null,
    timestamp: UnixTimestamp,
  ): ResultAsync<number, PersistenceError>;

  restoreBackup(backup: IDataWalletBackup): ResultAsync<void, PersistenceError>;
  pollBackups(): ResultAsync<void, PersistenceError>;
  postBackups(): ResultAsync<DataWalletBackupID[], PersistenceError>;
  clearCloudStore(): ResultAsync<void, PersistenceError>;
  waitForRestore(): ResultAsync<EVMPrivateKey, never>;
}

export const IDataWalletPersistenceType = Symbol.for("IDataWalletPersistence");
