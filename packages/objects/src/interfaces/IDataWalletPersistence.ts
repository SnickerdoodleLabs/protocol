import { ResultAsync } from "neverthrow";

import { IEVMBalance } from "./chains";

import {
  ClickData,
  ClickFilter,
  EVMTransaction,
  EVMTransactionFilter,
  IEVMNFT,
  SiteVisit,
} from "@objects/businessObjects";
import { PersistenceError } from "@objects/errors";
import {
  Age,
  EmailAddressString,
  ChainId,
  EVMAccountAddress,
  EVMContractAddress,
  EVMPrivateKey,
  GivenName,
  Gender,
  FamilyName,
  CountryCode,
  UnixTimestamp,
  URLString,
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
   * This method adds an ethereum account to the data wallet. Only these accounts may unlock the
   * wallet.
   * @param accountAddress
   */
  addAccount(
    accountAddress: EVMAccountAddress,
  ): ResultAsync<void, PersistenceError>;

  /**
   * This method returns all the Ethereum accounts that are registered in the data wallet.
   */
  getAccounts(): ResultAsync<EVMAccountAddress[], PersistenceError>;

  /**
   * This is an example method for adding data to the wallet. In this case, it would be a "click",
   * presumeably captured by the Form Factor.
   */
  addClick(click: ClickData): ResultAsync<void, PersistenceError>;

  /** This returns you click data that you have stored, according to the filter */
  getClicks(clickFilter: ClickFilter): ResultAsync<ClickData, PersistenceError>;

  /** Google User Information */
  setAge(age: Age): ResultAsync<void, PersistenceError>;
  getAge(): ResultAsync<Age, PersistenceError>;

  setGivenName(name: GivenName): ResultAsync<void, PersistenceError>;
  getGivenName(): ResultAsync<GivenName, PersistenceError>;

  setFamilyName(name: FamilyName): ResultAsync<void, PersistenceError>;
  getFamilyName(): ResultAsync<FamilyName, PersistenceError>;

  setBirthday(birthday: UnixTimestamp): ResultAsync<void, PersistenceError>;
  getBirthday(): ResultAsync<UnixTimestamp, PersistenceError>;

  setGender(gender: Gender): ResultAsync<void, PersistenceError>;
  getGender(): ResultAsync<Gender, PersistenceError>;

  setEmail(email: EmailAddressString): ResultAsync<void, PersistenceError>;
  getEmail(): ResultAsync<EmailAddressString, PersistenceError>;

  setLocation(location: CountryCode): ResultAsync<void, PersistenceError>;
  getLocation(): ResultAsync<CountryCode, PersistenceError>;

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

  getLatestTransactionForAccount(
    chainId: ChainId,
    address: EVMAccountAddress,
  ): ResultAsync<EVMTransaction | null, PersistenceError>;
  addEVMTransactions(
    transactions: EVMTransaction[],
  ): ResultAsync<void, PersistenceError>;
  getEVMTransactions(
    filter: EVMTransactionFilter,
  ): ResultAsync<EVMTransaction[], PersistenceError>;

  updateAccountBalances(
    balances: IEVMBalance[],
  ): ResultAsync<void, PersistenceError>;
  getAccountBalances(): ResultAsync<IEVMBalance[], PersistenceError>;

  updateAccountNFTs(nfts: IEVMNFT[]): ResultAsync<void, PersistenceError>;
  getAccountNFTs(): ResultAsync<IEVMNFT[], PersistenceError>;

  addURL(url: URLString): ResultAsync<void, PersistenceError>;
  getURLs(): ResultAsync<Map<URLString, number>, PersistenceError>;
}

export const IDataWalletPersistenceType = Symbol.for("IDataWalletPersistence");
