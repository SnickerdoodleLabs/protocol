import { ResultAsync } from "neverthrow";

import {
  Invitation,
  DataPermissions,
  SDQLQuery,
  PageInvitation,
  SiteVisit,
  LinkedAccount,
  TokenBalance,
  WalletNFT,
  TokenAddress,
  EarnedReward,
  IDynamicRewardParameter,
  ChainTransaction,
  TransactionFilter,
  TokenMarketData,
  TokenInfo,
  MarketplaceListing,
  TransactionPaymentCounter,
  EligibleAd,
  AdSignature,
} from "@objects/businessObjects";
import { EChain, EInvitationStatus, EScamFilterStatus } from "@objects/enum";
import {
  AccountIndexingError,
  AjaxError,
  BlockchainProviderError,
  ConsentContractError,
  ConsentContractRepositoryError,
  ConsentError,
  ConsentFactoryContractError,
  CrumbsContractError,
  EvaluationError,
  InvalidParametersError,
  InvalidSignatureError,
  IPFSError,
  MinimalForwarderContractError,
  PersistenceError,
  QueryFormatError,
  SiftContractError,
  UninitializedError,
  UnsupportedLanguageError,
} from "@objects/errors";
import { IDataWalletBackup } from "@objects/interfaces/IDataWalletBackup";
import { IOpenSeaMetadata } from "@objects/interfaces/IOpenSeaMetadata";
import { ISnickerdoodleCoreEvents } from "@objects/interfaces/ISnickerdoodleCoreEvents";
import {
  AccountAddress,
  Age,
  ChainId,
  CountryCode,
  DataWalletAddress,
  DataWalletBackupID,
  DomainName,
  EmailAddressString,
  EVMContractAddress,
  FamilyName,
  Gender,
  GivenName,
  HexString32,
  IpfsCID,
  LanguageCode,
  SHA256Hash,
  Signature,
  UnixTimestamp,
  URLString,
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
   * unlockWithSolana() is identical to unlock() but uses a Solana account address instead of an
   * EVM based account. Internally, it will map the Solana account to an EVM account using the signature
   * to generate an EVM private key. This key will generate the EVM account address, but will also be
   * stored in memory and used to sign the metatransaction for the crumb. The Solana wallet will never
   * have to sign the metatransaction request itself, unlike unlock(); so this method will never generate
   * a MetatransactionSignatureRequestedEvent.
   * @param signature
   * @param countryCode
   */
  unlock(
    accountAddress: AccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    chain: EChain,
  ): ResultAsync<
    void,
    | PersistenceError
    | AjaxError
    | BlockchainProviderError
    | UninitializedError
    | CrumbsContractError
    | InvalidSignatureError
    | UnsupportedLanguageError
    | MinimalForwarderContractError
  >;

  /**
   * addAccount() adds an additional account to the data wallet. It is almost
   * identical to logging in, but the Snickerdoodle Core must be initialized first (with an
   * existing account). A connected account will be monitored for activity, and
   * can be used for subsequent logins. This can prevent you from being locked out
   * of your data wallet, as long as you have at least 2 accounts connected.
   * addSolanaAccount() is identical to addAccount, but adds a Solana (non-EVM) account.
   * Like unlock, an EVM private key will be derived from the signature and used for the account
   * the crumb is assigned to on the doodlechain.
   * @param accountAddress
   * @param signature
   * @param countryCode
   */
  addAccount(
    accountAddress: AccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    chain: EChain,
  ): ResultAsync<
    void,
    | BlockchainProviderError
    | UninitializedError
    | CrumbsContractError
    | InvalidSignatureError
    | UnsupportedLanguageError
    | PersistenceError
    | AjaxError
    | MinimalForwarderContractError
  >;

  /**
   * unlinkAccount() will un-link a Solana account from the data wallet, but works differently
   * from getUnlinkAccountRequest(). It requires a signature from the account to derive the EVM key,
   * but it can then sign the metatransaction to burn the crumb directly.
   * @param accountAddress
   */
  unlinkAccount(
    accountAddress: AccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    chain: EChain,
  ): ResultAsync<
    void,
    | PersistenceError
    | InvalidParametersError
    | BlockchainProviderError
    | UninitializedError
    | InvalidSignatureError
    | UnsupportedLanguageError
    | CrumbsContractError
    | AjaxError
    | MinimalForwarderContractError
  >;

  /**
   * Checks if the account address has already been linked to a data wallet, and returns the
   * address of the data wallet. You can only do this if you control the account address, since
   * it requires you to decrypt the crumb. If there is no crumb, it returns null.
   * @param accountAddress
   * @param signature
   * @param languageCode
   * @param chain
   */
  getDataWalletForAccount(
    accountAddress: AccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    chain: EChain,
  ): ResultAsync<
    DataWalletAddress | null,
    | PersistenceError
    | UninitializedError
    | BlockchainProviderError
    | CrumbsContractError
    | InvalidSignatureError
    | UnsupportedLanguageError
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
   * @param dataPermissions OPTIONAL. Any conditions for query consent that should be baked into the consent token.
   */
  acceptInvitation(
    invitation: Invitation,
    dataPermissions: DataPermissions | null,
  ): ResultAsync<
    void,
    | PersistenceError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
    | MinimalForwarderContractError
    | ConsentError
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
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | AjaxError
    | PersistenceError
    | MinimalForwarderContractError
    | ConsentError
  >;

  getAcceptedInvitations(): ResultAsync<Invitation[], PersistenceError>;

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

  getConsentContractCID(
    consentAddress: EVMContractAddress,
  ): ResultAsync<
    IpfsCID,
    BlockchainProviderError | UninitializedError | ConsentContractError
  >;

  getAcceptedInvitationsCID(): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | ConsentFactoryContractError
    | PersistenceError
  >;

  getInvitationMetadataByCID(
    ipfsCID: IpfsCID,
  ): ResultAsync<IOpenSeaMetadata, IPFSError>;

  checkURL(
    domain: DomainName,
  ): ResultAsync<
    EScamFilterStatus,
    BlockchainProviderError | UninitializedError | SiftContractError
  >;

  // Called by the form factor to approve the processing of the query.
  // This is basically per-query consent. The consent token will be
  // re-checked, of course (trust nobody!).
  processQuery(
    consentContractAddress: EVMContractAddress,
    query: SDQLQuery,
    parameters: IDynamicRewardParameter[],
  ): ResultAsync<
    void,
    | AjaxError
    | UninitializedError
    | ConsentError
    | IPFSError
    | QueryFormatError
    | EvaluationError
  >;

  getAgreementFlags(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    HexString32,
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | ConsentFactoryContractError
    | PersistenceError
    | ConsentError
  >;

  getAvailableInvitationsCID(): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
    | BlockchainProviderError
    | UninitializedError
    | ConsentFactoryContractError
    | ConsentContractError
    | PersistenceError
  >;

  restoreBackup(backup: IDataWalletBackup): ResultAsync<void, PersistenceError>;

  getEarnedRewards(): ResultAsync<EarnedReward[], PersistenceError>;
  addEarnedRewards(
    rewards: EarnedReward[],
  ): ResultAsync<void, PersistenceError>;

  onAdDisplayed(eligibleAd: EligibleAd): ResultAsync<void, UninitializedError | IPFSError | PersistenceError>;

  getEligibleAds(): ResultAsync<EligibleAd[], PersistenceError>;
  getAdSignatures(): ResultAsync<AdSignature[], PersistenceError>;

  getEvents(): ResultAsync<ISnickerdoodleCoreEvents, never>;

  isDataWalletAddressInitialized(): ResultAsync<boolean, never>;

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

  addSiteVisits(siteVisits: SiteVisit[]): ResultAsync<void, PersistenceError>;
  getSiteVisits(): ResultAsync<SiteVisit[], PersistenceError>;
  getSiteVisitsMap(): ResultAsync<Map<URLString, number>, PersistenceError>;

  getAccounts(): ResultAsync<LinkedAccount[], PersistenceError>;
  getAccountBalances(): ResultAsync<TokenBalance[], PersistenceError>;
  getAccountNFTs(): ResultAsync<WalletNFT[], PersistenceError>;
  getTransactionValueByChain(): ResultAsync<
    TransactionPaymentCounter[],
    PersistenceError
  >;

  postBackups(): ResultAsync<DataWalletBackupID[], PersistenceError>;
  clearCloudStore(): ResultAsync<void, PersistenceError>;

  getTokenPrice(
    chainId: ChainId,
    address: TokenAddress | null,
    timestamp: UnixTimestamp,
  ): ResultAsync<number, PersistenceError>;

  getTokenMarketData(
    ids: string[],
  ): ResultAsync<TokenMarketData[], AccountIndexingError>;

  getTokenInfo(
    chainId: ChainId,
    contractAddress: TokenAddress | null,
  ): ResultAsync<TokenInfo | null, AccountIndexingError>;

  getTransactions(
    filter?: TransactionFilter,
  ): ResultAsync<ChainTransaction[], PersistenceError>;
  addTransactions(
    transactions: ChainTransaction[],
  ): ResultAsync<void, PersistenceError>;
  getMarketplaceListings(
    count?: number | undefined,
    headAt?: number | undefined,
  ): ResultAsync<
    MarketplaceListing,
    BlockchainProviderError | UninitializedError | ConsentFactoryContractError
  >;
  getListingsTotal(): ResultAsync<
    number,
    UninitializedError | BlockchainProviderError | ConsentFactoryContractError
  >;
}

export const ISnickerdoodleCoreType = Symbol.for("ISnickerdoodleCore");
