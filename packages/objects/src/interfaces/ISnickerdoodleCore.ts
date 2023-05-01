import {
  AdSignature,
  ChainTransaction,
  DataPermissions,
  DataWalletBackup,
  DiscordGuildProfile,
  DiscordProfile,
  EarnedReward,
  EligibleAd,
  IDynamicRewardParameter,
  Invitation,
  TokenAndSecret,
  LinkedAccount,
  MarketplaceListing,
  PagedResponse,
  PageInvitation,
  PagingRequest,
  PossibleReward,
  SDQLQuery,
  SiteVisit,
  TokenAddress,
  TokenBalance,
  TokenInfo,
  TokenMarketData,
  TransactionFilter,
  TransactionPaymentCounter,
  TwitterProfile,
  WalletNFT,
} from "@objects/businessObjects";
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
  DiscordError,
  EvaluationError,
  InvalidParametersError,
  InvalidSignatureError,
  IPFSError,
  KeyGenerationError,
  MinimalForwarderContractError,
  OAuthError,
  PersistenceError,
  QueryFormatError,
  SiftContractError,
  TwitterError,
  UnauthorizedError,
  UninitializedError,
  UnsupportedLanguageError,
} from "@objects/errors";
import { IConsentCapacity } from "@objects/interfaces/IConsentCapacity";
import { IOpenSeaMetadata } from "@objects/interfaces/IOpenSeaMetadata";
import { ISnickerdoodleCoreEvents } from "@objects/interfaces/ISnickerdoodleCoreEvents";
import {
  AccountAddress,
  AdKey,
  AdSurfaceId,
  Age,
  BackupFileName,
  OAuth1RequstToken,
  ChainId,
  CountryCode,
  DataWalletAddress,
  DataWalletBackupID,
  DiscordID,
  DomainName,
  EmailAddressString,
  EVMContractAddress,
  FamilyName,
  Gender,
  GivenName,
  HexString32,
  IpfsCID,
  JsonWebToken,
  LanguageCode,
  MarketplaceTag,
  OAuthAuthorizationCode,
  OAuthVerifier,
  PEMEncodedRSAPublicKey,
  SHA256Hash,
  Signature,
  TwitterID,
  UnixTimestamp,
  URLString,
} from "@objects/primitives";
import { ResultAsync } from "neverthrow";

/**
 ************************ MAINTENANCE HAZARD ***********************************************
 Whenever you add or change a method in this class, you also need to look at and probably update
 ISdlDataWallet.ts. This interface represents the actual core methods, but ISdlDataWallet mostly
 clones this interface, with some methods removed or added, but all of them updated to remove
 sourceDomain (which is managed by the integration package)
 */

export interface ICoreMarketplaceMethods {
  getMarketplaceListingsByTag(
    pagingReq: PagingRequest,
    tag: MarketplaceTag,
    filterActive: boolean, // make it optional in interface, = true here
  ): ResultAsync<
    PagedResponse<MarketplaceListing>,
    BlockchainProviderError | UninitializedError | ConsentFactoryContractError
  >;

  getListingsTotalByTag(
    tag: MarketplaceTag,
  ): ResultAsync<
    number,
    BlockchainProviderError | UninitializedError | ConsentFactoryContractError
  >;

  getRecommendationsByListing(
    listing: MarketplaceListing,
  ): ResultAsync<
    MarketplaceTag[],
    BlockchainProviderError | UninitializedError | ConsentContractError
  >;

  /**
   * This method will accept a list of consent contract addresses and returns
   * all possible rewards with their dependencies.
   * i.e. Join this campaign, share your age; and get a discount
   * @param contractAddresses List of consent contract addresses (of campaigns)
   * @param timeoutMs Timeout for fetching the queries from Ipfs, in case form
   * factor wants to tune the marketplace loading time.
   */
  getPossibleRewards(
    contractAddresses: EVMContractAddress[],
    timeoutMs?: number,
  ): ResultAsync<Map<EVMContractAddress, PossibleReward[]>, EvaluationError>;
}

export interface ICoreDiscordMethods {
  /**
   * This method will upsert a users discord profile and
   * discord guild data given a token which will come from discord api
   * @param authToken
   */
  initializeUserWithAuthorizationCode(
    code: OAuthAuthorizationCode,
  ): ResultAsync<void, DiscordError | PersistenceError>;

  /**
   * This method will return url for the discord api
   * call to be made. If user gives consent token can be used
   * to initialize the user
   */
  installationUrl(): ResultAsync<URLString, OAuthError>;

  getUserProfiles(): ResultAsync<DiscordProfile[], PersistenceError>;
  getGuildProfiles(): ResultAsync<DiscordGuildProfile[], PersistenceError>;
  /**
   * This method will remove a users discord profile and
   * discord guild data given their profile id
   * @param discordProfileId
   */
  unlink(
    discordProfileId: DiscordID,
  ): ResultAsync<void, DiscordError | PersistenceError>;
}

export interface ICoreTwitterMethods {
  getOAuth1aRequestToken(): ResultAsync<TokenAndSecret, TwitterError>;
  initTwitterProfile(
    requestToken: OAuth1RequstToken,
    oAuthVerifier: OAuthVerifier,
  ): ResultAsync<TwitterProfile, TwitterError | PersistenceError>;
  unlinkProfile(
    id: TwitterID,
  ): ResultAsync<void, TwitterError | PersistenceError>;
  getUserProfiles(): ResultAsync<TwitterProfile[], PersistenceError>;
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

  /**
   * Returns the public key used to sign JWTs for the requested domain. This should be requested
   * the first time a data wallet user interacts with a website, and stored for future visits.
   * This key along with the generated user ID will allow the website to securely verify the
   * data wallet as returning.
   * @param domain
   */
  getTokenVerificationPublicKey(
    domain: DomainName,
  ): ResultAsync<PEMEncodedRSAPublicKey, PersistenceError | KeyGenerationError>;

  /**
   * Returns a JWT bearer token, customized for the domain. The domain should be provided and
   * verified by the form factor, and not via a request, as with all other domain params.
   * The nonce can be any arbitrary data, and will be encoded as a claim in the token. The
   * purpose of it is to verify possetion of the key and that the token issued is fresh-
   * it is not a stolen token captured for elsewhere. A unique ID is generated for the domain,
   * a UUID, and will remain consistent for all interactions with that domain (sub claim in JWT).
   * This is meant to be the user ID for the data wallet. It is not traceable to the wallet or
   * between domains. Email and other identifing information is not included in the token.
   * The JWT will be signed with 4096 bit RSA key that is also generated per-domain. This key is
   * available via getTokenVerificationPublicKey() and can verify the token if required. The website
   * can obtain this public key on the first interaction and store it on their own server. Then,
   * any time a token is presented, they can verify the authenticity of the token for future visits.
   * @param nonce Any string, provided by the calling page. Included in the "nonce" claim in the token, to protect against replays. Assures a fresh token.
   * @param domain The domain requesting the token. The token will be customized for the domain.
   */
  getBearerToken(
    nonce: string,
    domain: DomainName,
  ): ResultAsync<
    JsonWebToken,
    InvalidSignatureError | PersistenceError | KeyGenerationError
  >;
}

export interface IAdMethods {
  /**
   * This method returns an EligibleAd that fits the adSurface, if any have been received.
   * If there are no ads that fit the context, it returns null
   * This method is where we do Contextual Targeting, as opposed to Demographic Targeting.
   * This method is also where the ad priority algorithm works, which may be arbitrarily
   * complex. When given a selection of ads that may be shown, we have to determine which one
   * goes first. This will be based at least partially on expiration dates and marketplace
   * stake for rank data.
   * @param adSurfaceId
   */
  getAd(
    adSurfaceId: AdSurfaceId /*adSurfaceDetails: Details */,
  ): ResultAsync<EligibleAd | null, PersistenceError>;

  /**
   * This method is called by the form factor after it displays an eligible ad.
   * We will store store the content hash with the eligible ad, and then when insights
   * are delivered, we will also return a list of AdKey:ContentHash pairs. The IP
   * will use that data to determine if you are eligible for rewards.
   * This method is the primary trigger for returning insights. Once a user has viewed
   * ALL EligibleAds for an SDQL Query, that is time for the core to calculate Insights,
   * and return to the IP.
   */
  reportAdShown(
    queryCID: IpfsCID,
    consentContractAddress: EVMContractAddress,
    key: AdKey,
    adSurfaceId: AdSurfaceId,
    contentHash: SHA256Hash,
  ): ResultAsync<void, PersistenceError>;

  /**
   * This method is used by the form factor to report that the user does not want to watch any
   * more ads for a particular query.
   * This method is one trigger for calculating and returning insights to the IP- if the user
   * does not want to watch all the ElibleAds, then it's time to return insights and Ad
   * signatures for the ads they did watch.
   */
  completeShowingAds(queryCID: IpfsCID): ResultAsync<void, PersistenceError>;
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
   * If this is a subsequent time, you will regain access to the existing wallet.
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
   * received notifications of queries for this cohort.
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

  getConsentCapacity(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    IConsentCapacity,
    BlockchainProviderError | UninitializedError | ConsentContractError
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
  approveQuery(
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

  updateDataPermissions(
    consentContractAddress: EVMContractAddress,
    dataPermissions: DataPermissions,
    sourceDomain?: DomainName,
  ): ResultAsync<
    void,
    | PersistenceError
    | UninitializedError
    | ConsentError
    | ConsentContractError
    | BlockchainProviderError
    | MinimalForwarderContractError
    | AjaxError
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

  restoreBackup(backup: DataWalletBackup): ResultAsync<void, PersistenceError>;
  unpackBackupChunk(
    backup: DataWalletBackup,
  ): ResultAsync<string, PersistenceError>;
  fetchBackup(
    backupHeader: string,
    sourceDomain?: DomainName,
  ): ResultAsync<DataWalletBackup[], PersistenceError>;

  getEarnedRewards(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<EarnedReward[], PersistenceError | UnauthorizedError>;
  addEarnedRewards(
    rewards: EarnedReward[],
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<void, PersistenceError>;
  onAdDisplayed(
    eligibleAd: EligibleAd,
    sourceDomain?: DomainName | undefined,
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
  listFileNames(
    sourceDomain?: DomainName,
  ): ResultAsync<BackupFileName[], PersistenceError>;

  getTokenPrice(
    chainId: ChainId,
    address: TokenAddress | null,
    timestamp: UnixTimestamp,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<number, AccountIndexingError>;

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
  discord: ICoreDiscordMethods;
  twitter: ICoreTwitterMethods;
}

export const ISnickerdoodleCoreType = Symbol.for("ISnickerdoodleCore");
