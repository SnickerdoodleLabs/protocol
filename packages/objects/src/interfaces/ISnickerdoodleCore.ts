import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

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
  RuntimeMetrics,
  QueryStatus,
  OAuth2Tokens,
  SiteVisitsMap,
  TransactionFlowInsight,
  OptInInfo,
  NftRepositoryCache,
  WalletNFTData,
  WalletNFTHistory,
  Questionnaire,
  QuestionnaireWithAnswers,
  QuestionnaireAnswer,
  NewQuestionnaireAnswer,
  // AuthenticatedStorageParams,
} from "@objects/businessObjects/index.js";
import {
  EChain,
  ECloudStorageType,
  EDataWalletPermission,
  EInvitationStatus,
  EQueryProcessingStatus,
} from "@objects/enum/index.js";
import {
  AccountIndexingError,
  AjaxError,
  BlockchainProviderError,
  ConsentContractError,
  ConsentContractRepositoryError,
  ConsentError,
  ConsentFactoryContractError,
  DiscordError,
  EvalNotImplementedError,
  EvaluationError,
  InvalidParametersError,
  InvalidSignatureError,
  IPFSError,
  KeyGenerationError,
  MinimalForwarderContractError,
  MissingASTError,
  MissingTokenConstructorError,
  OAuthError,
  PersistenceError,
  QueryExpiredError,
  QueryFormatError,
  BlockchainCommonErrors,
  TwitterError,
  UnauthorizedError,
  UninitializedError,
  UnsupportedLanguageError,
  DuplicateIdInSchema,
  MissingWalletDataTypeError,
  ParserError,
  MethodSupportError,
  InvalidQueryStatusError,
} from "@objects/errors/index.js";
import { IConsentCapacity } from "@objects/interfaces/IConsentCapacity.js";
import { IOldUserAgreement } from "@objects/interfaces/IOldUserAgreement.js";
import { ISnickerdoodleCoreEvents } from "@objects/interfaces/ISnickerdoodleCoreEvents.js";
import { IUserAgreement } from "@objects/interfaces/IUserAgreement.js";
import {
  AccountAddress,
  AdKey,
  AdSurfaceId,
  Age,
  BackupFileName,
  OAuth1RequstToken,
  ChainId,
  CountryCode,
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
  BlockNumber,
  RefreshToken,
  JSONString,
} from "@objects/primitives/index.js";
/**
 ************************ MAINTENANCE HAZARD ***********************************************
 Whenever you add or change a method in this class, you also need to look at and probably update
 ISdlDataWallet.ts. This interface represents the actual core methods, but ISdlDataWallet mostly
 clones this interface, with some methods removed or added, but all of them updated to remove
 sourceDomain (which is managed by the integration package)

 UPDATE: ISdlDataWallet for the most part is derived from this interface, and changes
 here should be reflected there. By and large, ISdlDataWallet contains all the
 methods of ISnickerdoodleCore, with the error types changed to ProxyError and
 the sourceDomain parameter removed. Some methods need special handling and that
 is done manually in ISdlDataWallet.
 */

/**
 * NOTE
 * There is a bug in PopTuple<> that seems to be an error in typescript, when dealing with optional (?)
 * parameters. Bascically, if you try to PopTuple<[string, number?]> it will
 * return "never" and not [string]. The solution is to use a non-optional parameter,
 * so sourceDomain is now "sourceDomain: DomainName | undefined" instead of optional,
 * at least on methods that are being dynamically altered in ISdlDataWallet.
 */

export interface IAccountMethods {
  /** getLinkAccountMessage() returns a localized string for the requested LanguageCode.
   * The Form Factor must have this string signed by the user's key (via Metamask,
   * wallet connect, etc), in order to call addAccount();
   */
  getLinkAccountMessage(
    languageCode: LanguageCode,
    sourceDomain: DomainName | undefined,
  ): ResultAsync<string, UnsupportedLanguageError | UnauthorizedError>;

  /**
   * addAccount() adds an additional account to the data wallet. It is almost
   * identical to logging in, but the Snickerdoodle Core must be initialized first (with an
   * existing account). A connected account will be monitored for activity, and
   * can be used for subsequent logins. This can prevent you from being locked out
   * of your data wallet, as long as you have at least 2 accounts connected.
   * addSolanaAccount() is identical to addAccount, but adds a Solana (non-EVM) account.
   * @param accountAddress
   * @param signature
   * @param countryCode
   */
  addAccount(
    accountAddress: AccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    chain: EChain,
    sourceDomain: DomainName | undefined,
  ): ResultAsync<
    void,
    | PersistenceError
    | UninitializedError
    | InvalidSignatureError
    | UnsupportedLanguageError
    | InvalidParametersError
  >;

  addAccountWithExternalSignature(
    accountAddress: AccountAddress,
    message: string,
    signature: Signature,
    chain: EChain,
    sourceDomain: DomainName | undefined,
  ): ResultAsync<
    void,
    | PersistenceError
    | UninitializedError
    | InvalidSignatureError
    | UnsupportedLanguageError
    | InvalidParametersError
  >;

  addAccountWithExternalTypedDataSignature(
    accountAddress: AccountAddress,
    domain: ethers.TypedDataDomain,
    types: Record<string, Array<ethers.TypedDataField>>,
    value: Record<string, unknown>,
    signature: Signature,
    chain: EChain,
    sourceDomain: DomainName | undefined,
  ): ResultAsync<
    void,
    | PersistenceError
    | UninitializedError
    | InvalidSignatureError
    | UnsupportedLanguageError
    | InvalidParametersError
  >;

  /**
   * unlinkAccount() will un-link a Solana account from the data wallet, but works differently
   * from getUnlinkAccountRequest(). It requires a signature from the account to derive the EVM key,
   * but it can then sign the metatransaction to burn the crumb directly.
   * @param accountAddress
   */
  unlinkAccount(
    accountAddress: AccountAddress,
    chain: EChain,
    sourceDomain: DomainName | undefined,
  ): ResultAsync<
    void,
    PersistenceError | UninitializedError | InvalidParametersError
  >;

  getAccounts(
    sourceDomain: DomainName | undefined,
  ): ResultAsync<LinkedAccount[], PersistenceError | UnauthorizedError>;
}

export interface ICoreMarketplaceMethods {
  getMarketplaceListingsByTag(
    pagingReq: PagingRequest,
    tag: MarketplaceTag,
    filterActive: boolean, // make it optional in interface, = true here
  ): ResultAsync<
    PagedResponse<MarketplaceListing>,
    | BlockchainProviderError
    | UninitializedError
    | ConsentFactoryContractError
    | BlockchainCommonErrors
  >;

  getListingsTotalByTag(
    tag: MarketplaceTag,
  ): ResultAsync<
    number,
    | BlockchainProviderError
    | UninitializedError
    | ConsentFactoryContractError
    | BlockchainCommonErrors
  >;

  getRecommendationsByListing(
    listing: MarketplaceListing,
  ): ResultAsync<
    MarketplaceTag[],
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | BlockchainCommonErrors
    | InvalidParametersError
  >;

  /**
   * This method will accept a list of consent contract addresses and returns
   * earned rewards with respect to queryCIDs
   * @param contractAddresses List of consent contract addresses (of campaigns)
   * @param timeoutMs Timeout for fetching the queries from Ipfs, in case form
   * factor wants to tune the marketplace loading time.
   */
  getEarnedRewardsByContractAddress(
    contractAddresses: EVMContractAddress[],
    timeoutMs?: number,
  ): ResultAsync<
    Map<EVMContractAddress, Map<IpfsCID, EarnedReward[]>>,
    | AjaxError
    | EvaluationError
    | QueryFormatError
    | ParserError
    | QueryExpiredError
    | DuplicateIdInSchema
    | MissingTokenConstructorError
    | MissingASTError
    | MissingWalletDataTypeError
    | UninitializedError
    | BlockchainProviderError
    | ConsentFactoryContractError
    | ConsentContractError
    | BlockchainCommonErrors
    | PersistenceError
    | EvalNotImplementedError
    | ConsentError
  >;
}

export interface ICoreDiscordMethods {
  /**
   * This method will upsert a users discord profile and
   * discord guild data given a token which will come from discord api
   * @param authToken
   */
  initializeUserWithAuthorizationCode(
    code: OAuthAuthorizationCode,
    sourceDomain: DomainName | undefined,
  ): ResultAsync<void, DiscordError | PersistenceError>;

  /**
   * This method will return url for the discord api
   * call to be made. If user gives consent token can be used
   * to initialize the user
   */
  installationUrl(
    sourceDomain: DomainName | undefined,
  ): ResultAsync<URLString, OAuthError>;

  getUserProfiles(
    sourceDomain: DomainName | undefined,
  ): ResultAsync<DiscordProfile[], PersistenceError>;
  getGuildProfiles(
    sourceDomain: DomainName | undefined,
  ): ResultAsync<DiscordGuildProfile[], PersistenceError>;
  /**
   * This method will remove a users discord profile and
   * discord guild data given their profile id
   * @param discordProfileId
   */
  unlink(
    discordProfileId: DiscordID,
    sourceDomain: DomainName | undefined,
  ): ResultAsync<void, DiscordError | PersistenceError>;
}

export interface ICoreTwitterMethods {
  getOAuth1aRequestToken(
    sourceDomain: DomainName | undefined,
  ): ResultAsync<TokenAndSecret, TwitterError>;
  initTwitterProfile(
    requestToken: OAuth1RequstToken,
    oAuthVerifier: OAuthVerifier,
    sourceDomain: DomainName | undefined,
  ): ResultAsync<TwitterProfile, TwitterError | PersistenceError>;
  unlinkProfile(
    id: TwitterID,
    sourceDomain: DomainName | undefined,
  ): ResultAsync<void, TwitterError | PersistenceError>;
  getUserProfiles(
    sourceDomain: DomainName | undefined,
  ): ResultAsync<TwitterProfile[], PersistenceError>;
}

export interface ICoreIntegrationMethods {
  /**
   * This method grants the requested permissions to the wallet to the specified domain name.
   * Other than being initialized, there are no special requirements to do this- the host of the core
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
    sourceDomain: DomainName | undefined,
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

export interface IInvitationMethods {
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
    | BlockchainCommonErrors
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
    | InvalidParametersError
    | BlockchainCommonErrors
  >;

  /**
   * This method will reject an invitation, which simply puts it on a list for future
   * auto-rejection by the form factor. Calling this will NOT opt the user out of a cohort
   * they have already opted into. You need to call leaveCohort() instead. It will return
   * an error if the user has already consented (you did check the status first with checkInvitationStatus(),
   * right?)
   * If rejectUtil is provided, the rejection will be temporary instead- acting like
   * an "ask me later" feature. The invitation will be treated as rejected until the timestamp
   * is passed.
   */
  rejectInvitation(
    invitation: Invitation,
    rejectUntil?: UnixTimestamp,
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
    | BlockchainCommonErrors
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
    | BlockchainCommonErrors
  >;

  getAcceptedInvitations(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<OptInInfo[], PersistenceError | UnauthorizedError>;

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
    | PersistenceError
    | BlockchainCommonErrors
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
    | BlockchainCommonErrors
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
    | BlockchainCommonErrors
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
    | BlockchainCommonErrors
  >;

  getInvitationMetadataByCID(
    ipfsCID: IpfsCID,
  ): ResultAsync<
    IOldUserAgreement | IUserAgreement,
    IPFSError | UnauthorizedError
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
    | BlockchainCommonErrors
  >;
}

export interface IMetricsMethods {
  /**
   * Returns the current runtime data for the user's data wallet.
   */
  getMetrics(
    sourceDomain: DomainName | undefined,
  ): ResultAsync<RuntimeMetrics, never>;

  getNFTCache(
    sourceDomain: DomainName | undefined,
  ): ResultAsync<NftRepositoryCache, PersistenceError>;
  getPersistenceNFTs(
    sourceDomain: DomainName | undefined,
  ): ResultAsync<WalletNFTData[], PersistenceError>;
  getNFTsHistory(
    sourceDomain: DomainName | undefined,
  ): ResultAsync<WalletNFTHistory[], PersistenceError>;
}

export interface INftMethods {
  getNfts(
    benchmark: UnixTimestamp | undefined,
    chains: EChain[] | undefined,
    accounts: LinkedAccount[] | undefined,
    sourceDomain: DomainName | undefined,
  ): ResultAsync<
    WalletNFT[],
    | PersistenceError
    | AccountIndexingError
    | AjaxError
    | MethodSupportError
    | InvalidParametersError
  >;
}

export interface IStorageMethods {
  setAuthenticatedStorage(
    type: ECloudStorageType,
    path: string,
    refreshToken: RefreshToken,
    sourceDomain: DomainName | undefined,
  ): ResultAsync<void, PersistenceError>;
  authenticateDropbox(
    code: string,
    sourceDomain: DomainName | undefined,
  ): ResultAsync<OAuth2Tokens, AjaxError>;
  getCurrentCloudStorage(
    sourceDomain: DomainName | undefined,
  ): ResultAsync<ECloudStorageType, never>;
  getAvailableCloudStorageOptions(
    sourceDomain: DomainName | undefined,
  ): ResultAsync<Set<ECloudStorageType>, never>;
  getDropboxAuth(
    sourceDomain: DomainName | undefined,
  ): ResultAsync<URLString, never>;
}

export interface IQuestionnaireMethods {
  /**
   * Returns a list of questionnaires that the user can complete (that do not already have answers),
   * without regard to any particular consent contract. They are returned in ranked order and should
   * be presented to the user in that order.
   * @param sourceDomain
   */
  getQuestionnaires(
    pagingRequest: PagingRequest,
    sourceDomain: DomainName | undefined,
  ): ResultAsync<
    PagedResponse<Questionnaire>,
    | UninitializedError
    | BlockchainCommonErrors
    | AjaxError
    | PersistenceError
    | ConsentFactoryContractError
  >;

  /**
   * Returns a list of questionnaires that the user can complete, which are requested by a particular
   * consent contract. They are returned in ranked order and should be presented to the user in that order.
   *
   * @param consentContractAddress
   * @param sourceDomain
   */
  getQuestionnairesForConsentContract(
    pagingRequest: PagingRequest,
    consentContractAddress: EVMContractAddress,
    sourceDomain: DomainName | undefined,
  ): ResultAsync<
    PagedResponse<Questionnaire | QuestionnaireWithAnswers>,
    | UninitializedError
    | BlockchainCommonErrors
    | AjaxError
    | PersistenceError
    | ConsentContractError
  >;

  /**
   * Gets all teh questionnaires that the user has already answered, along with the current answers
   * @param sourceDomain
   */
  getAnsweredQuestionnaires(
    pagingRequest: PagingRequest,
    sourceDomain: DomainName | undefined,
  ): ResultAsync<
    PagedResponse<QuestionnaireWithAnswers>,
    PersistenceError | AjaxError
  >;

  /**
   * This method provides answers to a single questionnaire. The provided answers must all
   * be for the same questionnaire. If the questionnaire is not found, or if the answers are
   * not valid, and InvalidParametersError is returned.
   * @param questionnaireId The IPFS CID of the questionnaire you are providing answers for.
   * @param answers
   */
  answerQuestionnaire(
    questionnaireId: IpfsCID,
    answers: NewQuestionnaireAnswer[],
    sourceDomain: DomainName | undefined,
  ): ResultAsync<void, InvalidParametersError | PersistenceError | AjaxError>;

  /**
   * Fetches all questionnaires in storage with pagination
   * This method can return either basic questionnaires or questionnaires with their answers if available,
   * */
  getAllQuestionnaires(
    pagingRequest: PagingRequest,
    sourceDomain: DomainName | undefined,
  ): ResultAsync<
    PagedResponse<Questionnaire | QuestionnaireWithAnswers>,
    | UninitializedError
    | BlockchainCommonErrors
    | AjaxError
    | PersistenceError
    | ConsentFactoryContractError
  >;

  /**
   * Retrieves consent contract addresses associated with a given Questionnaire IPFS CID.
   *  This method is useful for finding out which consent contracts (brand) is interested in the the supplied Questionnaire
   *
   * @param ipfsCID The IPFS CID of the questionnaire
   * @return An array of consent contract addresses
   */
  getConsentContractsByQuestionnaireCID(
    ipfsCID: IpfsCID,
    sourceDomain: DomainName | undefined,
  ): ResultAsync<
    EVMContractAddress[],
    | PersistenceError
    | UninitializedError
    | ConsentFactoryContractError
    | BlockchainCommonErrors
    | ConsentContractError
    | AjaxError
  >;

  /**
   * This is a key marketing function. Based on the questionnaires that the user has answered,
   * this returns a list of consent contracts that are interested in that questionnaire. This is
   * where stake for rank comes in. Each questionnaire (regardless of if it's a default one or not),
   * can be staked by a consent contract.
   * @param sourceDomain
   */
  getRecommendedConsentContracts(
    questionnaire: IpfsCID,
    sourceDomain: DomainName | undefined,
  ): ResultAsync<EVMContractAddress[], PersistenceError | AjaxError>;

  getByCIDs(
    questionnaireCIDs: IpfsCID[],
    sourceDomain: DomainName | undefined,
  ): ResultAsync<
    (Questionnaire | QuestionnaireWithAnswers)[],
    PersistenceError | AjaxError
  >;
}

export interface ISnickerdoodleCore {
  /**
   * initialize() should be the first call you make on a new SnickerdoodleCore.
   * It looks for an existing source entropy in volatile storage, and
   * if it doesn't exist, it creates it.
   * @param signature
   * @param countryCode
   */
  initialize(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<
    void,
    PersistenceError | UninitializedError | BlockchainProviderError | AjaxError
  >;

  getConsentContractURLs(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    URLString[],
    | UninitializedError
    | BlockchainProviderError
    | ConsentContractError
    | BlockchainCommonErrors
  >;

  getConsentCapacity(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    IConsentCapacity,
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | BlockchainCommonErrors
  >;

  getConsentContractCID(
    consentAddress: EVMContractAddress,
  ): ResultAsync<
    IpfsCID,
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | UnauthorizedError
    | BlockchainCommonErrors
  >;

  // Called by the form factor to approve the processing of the query.
  // This is basically per-query consent. The consent token will be
  // re-checked, of course (trust nobody!).
  approveQuery(
    queryCID: IpfsCID,
    parameters: IDynamicRewardParameter[],
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<
    void,
    | AjaxError
    | UninitializedError
    | ConsentError
    | IPFSError
    | QueryFormatError
    | PersistenceError
    | InvalidQueryStatusError
    | InvalidParametersError
  >;

  getQueryStatusByQueryCID(
    queryCID: IpfsCID,
  ): ResultAsync<QueryStatus | null, PersistenceError>;

  getQueryStatuses(
    contractAddress?: EVMContractAddress,
    status?: EQueryProcessingStatus,
    blockNumber?: BlockNumber,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<
    QueryStatus[],
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | BlockchainCommonErrors
    | PersistenceError
  >;

  /**
   * Restores a backup directly. Should only be called for testing purposes.
   * @param backup
   */
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
  getGivenName(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<GivenName | null, PersistenceError | UnauthorizedError>;

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
  ): ResultAsync<SiteVisitsMap, PersistenceError | UnauthorizedError>;

  getAccountBalances(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<TokenBalance[], PersistenceError | UnauthorizedError>;

  getTransactionValueByChain(
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<
    TransactionFlowInsight[],
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

  // external calls to set local storage
  setUIState(state: JSONString): ResultAsync<void, PersistenceError>;
  getUIState(): ResultAsync<JSONString | null, PersistenceError>;

  account: IAccountMethods;
  invitation: IInvitationMethods;
  marketplace: ICoreMarketplaceMethods;
  integration: ICoreIntegrationMethods;
  discord: ICoreDiscordMethods;
  twitter: ICoreTwitterMethods;
  metrics: IMetricsMethods;
  storage: IStorageMethods;
  nft: INftMethods;
  questionnaire: IQuestionnaireMethods;
}

export const ISnickerdoodleCoreType = Symbol.for("ISnickerdoodleCore");
