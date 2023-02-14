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
} from "@objects/businessObjects/index.js";
import {
  EChain,
  EDataWalletPermission,
  EInvitationStatus,
  EScamFilterStatus,
} from "@objects/enum";
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
  UnauthorizedError,
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
  Signature,
  UnixTimestamp,
  URLString,
} from "@objects/primitives";

/**
 ************************ MAINTENANCE HAZARD ***********************************************
 Whenever you add or change a method in this class, you also need to look at and probably update
 ISdlDataWallet.ts. This interface represents the actual core methods, but ISdlDataWallet mostly
 clones this interface, with some methods removed or added, but all of them updated to remove
 sourceDomain (which is managed by the integration package)
 */

export interface ICoreMarketplaceMethods {
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

export interface ICoreIntegrationMethods {
  /**
   * This method grants the requested permissions to the wallet to the specified domain name.
   * Other than being unlocked, there are no special requirements to do this- the host of the core
   * is assumed to know what it's doing here. The permissions are only enforced on a particular method
   * if the sourceDomain parameter is provided; which again is up to the core host. The integration
   * package must determine if a request should be permissioned and pass along the sourceDomain.
   * The way this works in practice is that you have a single instance of Core running in a
   * browser extension, but a proxy is injected via the BrowserExtensionIntegration package into
   * 3 tabs, A, B, and C. When the proxy for A is used, the request goes to the singleton Core, but
   * is provided with A as the sourceDomain, so the core will process the request permissioned for
   * domain A. The host is not required to pass or use sourceDomain, which will then ignore the
   * permissions system.
   *
   * This method always adds additional permissions- you don't have to pass a complete list. It's
   * just a list of additional permissions. Permissions are revoked completely with revokePermissions()
   */
  grantPermissions(
    permissions: EDataWalletPermission[],
    domain: DomainName,
  ): ResultAsync<void, PersistenceError>;

  /**
   * Revokes all permissions for the domain
   * @param domain
   */
  revokePermissions(domain: DomainName): ResultAsync<void, PersistenceError>;

  /**
   * This method is called by the data wallet proxy when it wants to get permissions. A
   * PermissionsRequestedEvent is emitted after confirming there's new permissions to grant. The
   * method will not return until the permissions are granted.
   * @param permissions The list of permissions you want
   * @param sourceDomain The domain that is requesting them
   * @returns The list of permissions actually granted- this may not match the list requested. If permissions were previously granted then the whole list is returned. This should be identical to the return from getPermissions()
   */
  requestPermissions(
    permissions: EDataWalletPermission[],
    sourceDomain: DomainName,
  ): ResultAsync<EDataWalletPermission[], PersistenceError>;

  /**
   * Returns the granted permissions for a particular domain
   * @param domain
   */
  getPermissions(
    domain: DomainName,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<EDataWalletPermission[], PersistenceError | UnauthorizedError>;
}

export interface ISnickerdoodleCore {
  /** getUnlockMessage() returns a localized string for the requested LanguageCode.
   * The Form Factor must have this string signed by the user's key (via Metamask,
   * wallet connect, etc), in order to call unlock() or addAccount();
   */
  getUnlockMessage(
    languageCode: LanguageCode,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<string, UnsupportedLanguageError | UnauthorizedError>;

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
    sourceDomain?: DomainName | undefined,
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
    | UnauthorizedError
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
    sourceDomain?: DomainName | undefined,
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
    | UnauthorizedError
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
    sourceDomain?: DomainName | undefined,
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
    | UnauthorizedError
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
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<
    DataWalletAddress | null,
    | PersistenceError
    | UninitializedError
    | BlockchainProviderError
    | CrumbsContractError
    | InvalidSignatureError
    | UnsupportedLanguageError
    | UnauthorizedError
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
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<
    EInvitationStatus,
    | BlockchainProviderError
    | PersistenceError
    | UninitializedError
    | AjaxError
    | ConsentContractError
    | ConsentContractRepositoryError
    | UnauthorizedError
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
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<
    void,
    | PersistenceError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
    | MinimalForwarderContractError
    | ConsentError
    | UnauthorizedError
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
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<
    void,
    | BlockchainProviderError
    | PersistenceError
    | UninitializedError
    | ConsentError
    | AjaxError
    | ConsentContractError
    | ConsentContractRepositoryError
    | UnauthorizedError
  >;

  /**
   * This method will actually burn a user's consent token. This data wallet will no longer
   * recieve notifications of queries for this cohort.
   * @param consentContractAddress
   */
  leaveCohort(
    consentContractAddress: EVMContractAddress,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<
    void,
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | AjaxError
    | PersistenceError
    | MinimalForwarderContractError
    | ConsentError
    | UnauthorizedError
  >;

  getAcceptedInvitations(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<Invitation[], PersistenceError | UnauthorizedError>;

  getInvitationsByDomain(
    domain: DomainName,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<
    PageInvitation[],
    | ConsentContractError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
    | IPFSError
    | UnauthorizedError
  >;

  getConsentContractCID(
    consentAddress: EVMContractAddress,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<
    IpfsCID,
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | UnauthorizedError
  >;

  getAcceptedInvitationsCID(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | ConsentFactoryContractError
    | PersistenceError
    | UnauthorizedError
  >;

  getInvitationMetadataByCID(
    ipfsCID: IpfsCID,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<IOpenSeaMetadata, IPFSError | UnauthorizedError>;

  checkURL(
    domain: DomainName,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<
    EScamFilterStatus,
    | BlockchainProviderError
    | UninitializedError
    | SiftContractError
    | UnauthorizedError
  >;

  // Called by the form factor to approve the processing of the query.
  // This is basically per-query consent. The consent token will be
  // re-checked, of course (trust nobody!).
  processQuery(
    consentContractAddress: EVMContractAddress,
    query: SDQLQuery,
    parameters: IDynamicRewardParameter[],
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<
    void,
    | AjaxError
    | UninitializedError
    | ConsentError
    | IPFSError
    | QueryFormatError
    | EvaluationError
    | UnauthorizedError
  >;

  getAgreementFlags(
    consentContractAddress: EVMContractAddress,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<
    HexString32,
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | ConsentFactoryContractError
    | PersistenceError
    | ConsentError
    | UnauthorizedError
  >;

  getAvailableInvitationsCID(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
    | BlockchainProviderError
    | UninitializedError
    | ConsentFactoryContractError
    | ConsentContractError
    | PersistenceError
    | UnauthorizedError
  >;

  restoreBackup(
    backup: IDataWalletBackup,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<void, PersistenceError | UnauthorizedError>;

  getEarnedRewards(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<EarnedReward[], PersistenceError | UnauthorizedError>;
  addEarnedRewards(
    rewards: EarnedReward[],
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<void, PersistenceError | UnauthorizedError>;

  onAdDisplayed(
    eligibleAd: EligibleAd,
  ): ResultAsync<void, UninitializedError | IPFSError | PersistenceError>;

  getEligibleAds(): ResultAsync<EligibleAd[], PersistenceError>;
  getAdSignatures(): ResultAsync<AdSignature[], PersistenceError>;

  getEvents(): ResultAsync<ISnickerdoodleCoreEvents, never>;

  isDataWalletAddressInitialized(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<boolean, UnauthorizedError>;

  setDefaultReceivingAddress(
    receivingAddress: AccountAddress | null,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<void, PersistenceError>;

  setReceivingAddress(
    contractAddress: EVMContractAddress,
    receivingAddress: AccountAddress | null,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<void, PersistenceError>;

  getReceivingAddress(
    contractAddress?: EVMContractAddress,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<AccountAddress, PersistenceError>;

  /** Google User Information */
  getAge(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<Age | null, PersistenceError>;

  setGivenName(
    name: GivenName,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<void, PersistenceError | UnauthorizedError>;
  getGivenName(): ResultAsync<
    GivenName | null,
    PersistenceError | UnauthorizedError
  >;

  setFamilyName(
    name: FamilyName,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<void, PersistenceError | UnauthorizedError>;
  getFamilyName(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<FamilyName | null, PersistenceError | UnauthorizedError>;

  setBirthday(
    birthday: UnixTimestamp,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<void, PersistenceError | UnauthorizedError>;
  getBirthday(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<UnixTimestamp | null, PersistenceError | UnauthorizedError>;

  setGender(
    gender: Gender,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<void, PersistenceError | UnauthorizedError>;
  getGender(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<Gender | null, PersistenceError | UnauthorizedError>;

  setEmail(
    email: EmailAddressString,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<void, PersistenceError | UnauthorizedError>;
  getEmail(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<
    EmailAddressString | null,
    PersistenceError | UnauthorizedError
  >;

  setLocation(
    location: CountryCode,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<void, PersistenceError | UnauthorizedError>;
  getLocation(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<CountryCode | null, PersistenceError | UnauthorizedError>;

  addSiteVisits(
    siteVisits: SiteVisit[],
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<void, PersistenceError | UnauthorizedError>;
  getSiteVisits(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<SiteVisit[], PersistenceError | UnauthorizedError>;
  getSiteVisitsMap(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<Map<URLString, number>, PersistenceError | UnauthorizedError>;

  getAccounts(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<LinkedAccount[], PersistenceError | UnauthorizedError>;
  getAccountBalances(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<TokenBalance[], PersistenceError | UnauthorizedError>;
  getAccountNFTs(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<WalletNFT[], PersistenceError | UnauthorizedError>;
  getTransactionValueByChain(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<
    TransactionPaymentCounter[],
    PersistenceError | UnauthorizedError
  >;

  postBackups(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<DataWalletBackupID[], PersistenceError | UnauthorizedError>;
  clearCloudStore(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<void, PersistenceError | UnauthorizedError>;

  getTokenPrice(
    chainId: ChainId,
    address: TokenAddress | null,
    timestamp: UnixTimestamp,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<number, PersistenceError | UnauthorizedError>;

  getTokenMarketData(
    ids: string[],
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<TokenMarketData[], AccountIndexingError | UnauthorizedError>;

  getTokenInfo(
    chainId: ChainId,
    contractAddress: TokenAddress | null,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<TokenInfo | null, AccountIndexingError | UnauthorizedError>;

  getTransactions(
    filter?: TransactionFilter,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<ChainTransaction[], PersistenceError | UnauthorizedError>;
  addTransactions(
    transactions: ChainTransaction[],
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<void, PersistenceError | UnauthorizedError>;

  marketplace: ICoreMarketplaceMethods;
  integration: ICoreIntegrationMethods;
}

export const ISnickerdoodleCoreType = Symbol.for("ISnickerdoodleCore");
