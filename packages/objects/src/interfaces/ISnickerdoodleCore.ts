import { ResultAsync } from "neverthrow";
import { Observable } from "rxjs";

import {
  Invitation,
  ConsentConditions,
  IEVMNFT,
  SDQLQuery,
  SDQLQueryRequest,
  PageInvitation,
} from "@objects/businessObjects";
import { EInvitationStatus } from "@objects/enum";
import {
  AjaxError,
  BlockchainProviderError,
  ConsentContractError,
  ConsentContractRepositoryError,
  ConsentError,
  CrumbsContractError,
  EvaluationError,
  InvalidSignatureError,
  IPFSError,
  MinimalForwarderContractError,
  PersistenceError,
  QueryFormatError,
  UninitializedError,
  UnsupportedLanguageError,
} from "@objects/errors";
import { IEVMBalance } from "@objects/interfaces/chains";
import { ISnickerdoodleCoreEvents } from "@objects/interfaces/ISnickerdoodleCoreEvents";
import {
  Age,
  CountryCode,
  DataWalletAddress,
  DomainName,
  EmailAddressString,
  EVMAccountAddress,
  EVMContractAddress,
  FamilyName,
  Gender,
  GivenName,
  LanguageCode,
  Signature,
  UnixTimestamp,
} from "@objects/primitives";

export interface ISnickerdoodleCore {
  /** getUnlockMessage() returns a localized string for the requested LanguageCode.
   * The Form Factor must have this string signed by the user's key (via Metamask,
   * wallet connect, etc), in order to call unlock() or addAccount();
   */
  getUnlockMessage(
    languageCode: LanguageCode,
  ): ResultAsync<string, UnsupportedLanguageError>;

  /**
   * unlock() serves a very important task as it both initializes the Query Engine
   * and establishes the actual address of the data wallet. After getUnlockMessage(),
   * this should be the second method you call on the Snickerdoodle Core. If this is the first
   * time using this account + unlock message, the Data Wallet will be created.
   * If this is a subsequent time, you will regain access to the exisitng wallet.
   * For an existing wallet with multiple connected accounts, you can unlock with a
   * signature from any of the accounts (form factor can decide), but you cannot
   * add a new account via unlock, use addAccount() to link a new account once you
   * have already logged in. It will return an error if you call it twice.
   * @param signature
   * @param countryCode
   */
  unlock(
    accountAddress: EVMAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ): ResultAsync<
    void,
    | UnsupportedLanguageError
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | PersistenceError
    | InvalidSignatureError
    | AjaxError
    | CrumbsContractError
  >;

  /**
   * addAccount() adds an additional account to the data wallet. It is almost
   * identical to logging in, but the Snickerdoodle Core must be initialized first (with an
   * existing account). A connected account will be monitored for activity, and
   * can be used for subsequent logins. This can prevent you from being locked out
   * of your data wallet, as long as you have at least 2 accounts connected.
   * @param accountAddress
   * @param signature
   * @param countryCode
   */
  addAccount(
    accountAddress: EVMAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ): ResultAsync<
    void,
    | BlockchainProviderError
    | UninitializedError
    | PersistenceError
    | AjaxError
    | CrumbsContractError
  >;

  /**
   * This method checks the status of the invitation in relationship to the data wallet.
   * An invitation may be either "New" (haven't dealt with it one way or the other),
   * "Rejected" (previously, positively turned down), or "Accepted" (if we are already opted
   * in to the cohort)
   * @param invitation
   */
  checkInvitationStatus(
    invitation: Invitation,
  ): ResultAsync<
    EInvitationStatus,
    | BlockchainProviderError
    | PersistenceError
    | UninitializedError
    | AjaxError
    | ConsentContractError
    | ConsentContractRepositoryError
  >;

  /**
   * This method will accept an invitation, even if the user had previously rejected it.
   * Note that this is different than reject invitation, which will not opt you out of the
   * cohort
   * @param invitation The actual invitation to the cohort
   * @param consentConditions OPTIONAL. Any conditions for query consent that should be baked into the consent token.
   */
  acceptInvitation(
    invitation: Invitation,
    consentConditions: ConsentConditions | null,
  ): ResultAsync<
    void,
    | PersistenceError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
    | MinimalForwarderContractError
  >;

  /**
   * This method will reject an invitation, which simply puts it on a list for future
   * auto-rejection by the form factor. Calling this will NOT opt the user out of a cohort
   * they have already opted into. You need to call leaveCohort() instead. It will return
   * an error if the user has already consented (you did check the status first with checkInvitationStatus(),
   * right?)
   */
  rejectInvitation(
    invitation: Invitation,
  ): ResultAsync<
    void,
    | BlockchainProviderError
    | PersistenceError
    | UninitializedError
    | ConsentError
    | AjaxError
    | ConsentContractError
    | ConsentContractRepositoryError
  >;

  /**
   * This method will actually burn a user's consent token. This data wallet will no longer
   * recieve notifications of queries for this cohort.
   * @param consentContractAddress
   */
  leaveCohort(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    void,
    | ConsentContractError
    | ConsentContractRepositoryError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
    | MinimalForwarderContractError
    | ConsentError
  >;

  getInvitationsByDomain(
    domain: DomainName,
  ): ResultAsync<
    PageInvitation[],
    | ConsentContractError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
    | IPFSError
  >;
  
  initializeBlockchain();
  // initializeBlockchainListener();

  // Called by the form factor to approve the processing of the query.
  // This is basically per-query consent. The consent token will be
  // re-checked, of course (trust nobody!).
  processQuery(
    consentContractAddress: EVMContractAddress,
    query: SDQLQuery,
  ): ResultAsync<
    void,
    | AjaxError
    | UninitializedError
    | ConsentError
    | IPFSError
    | QueryFormatError
    | EvaluationError
  >;

  getEvents(): ResultAsync<ISnickerdoodleCoreEvents, never>;

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

  getAccounts(): ResultAsync<EVMAccountAddress[], PersistenceError>;
  getAccountBalances(): ResultAsync<IEVMBalance[], PersistenceError>;
  getAccountNFTs(): ResultAsync<IEVMNFT[], PersistenceError>;
}

export const ISnickerdoodleCoreType = Symbol.for("ISnickerdoodleCore");

export interface IQueryEngineEvents {
  onInitialized: Observable<DataWalletAddress>;
  onQueryPosted: Observable<{
    consentContractAddress: EVMContractAddress;
    query: SDQLQuery;
  }>;
  onAccountAdded: Observable<EVMAccountAddress>;
}
