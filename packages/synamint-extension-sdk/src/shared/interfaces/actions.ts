import {
  TypedDataDomain,
  TypedDataField,
} from "@ethersproject/abstract-signer";
import {
  BigNumberString,
  ChainId,
  CountryCode,
  DiscordID,
  DomainName,
  EmailAddressString,
  EVMContractAddress,
  FamilyName,
  Gender,
  GivenName,
  LanguageCode,
  Signature,
  UnixTimestamp,
  UUID,
  IpfsCID,
  EChain,
  EWalletDataType,
  AccountAddress,
  TokenAddress,
  IOldUserAgreement,
  LinkedAccount,
  TokenBalance,
  TokenMarketData,
  TokenInfo,
  WalletNFT,
  Age,
  DataWalletAddress,
  EInvitationStatus,
  EarnedReward,
  SiteVisit,
  URLString,
  MarketplaceListing,
  PagingRequest,
  MarketplaceTag,
  OAuthAuthorizationCode,
  DiscordProfile,
  DiscordGuildProfile,
  PagedResponse,
  IConsentCapacity,
  OAuth1RequstToken,
  OAuthVerifier,
  TwitterID,
  TwitterProfile,
  TokenAndSecret,
  RuntimeMetrics,
  EDataWalletPermission,
  PEMEncodedRSAPublicKey,
  JsonWebToken,
  JSONString,
  QueryStatus,
  ECloudStorageType,
  BlockNumber,
  RefreshToken,
  OAuth2Tokens,
  HTMLString,
  DomainTask,
  ELanguageCode,
  PageNumber,
  Year,
  PurchasedProduct,
  TransactionFlowInsight,
  ChainTransaction,
  TransactionFilter,
  IUserAgreement,
  ShoppingDataConnectionStatus,
  WalletNFTHistory,
  WalletNftWithHistory,
  NftRepositoryCache,
  WalletNFTData,
} from "@snickerdoodlelabs/objects";

import { IExtensionConfig } from "./IExtensionConfig";

import {
  ECoreActions,
  IExternalState,
  IInternalState,
} from "@synamint-extension-sdk/shared";

export abstract class CoreActionParams<TReturn> {
  public constructor(public method: ECoreActions) {}

  public returnMethodMarker(): TReturn {
    throw new Error("Shouldn't execute this, only used for typing purposes");
  }
}

export class UnlockParams extends CoreActionParams<void> {
  public constructor(
    public accountAddress: AccountAddress,
    public signature: Signature,
    public chain: EChain,
    public languageCode: LanguageCode,
  ) {
    super(UnlockParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.UNLOCK;
  }
}

export class AddAccountParams extends CoreActionParams<void> {
  public constructor(
    public accountAddress: AccountAddress,
    public signature: Signature,
    public chain: EChain,
    public languageCode: LanguageCode,
  ) {
    super(AddAccountParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.ADD_ACCOUNT;
  }
}

export class AddAccountWithExternalSignatureParams extends CoreActionParams<void> {
  public constructor(
    public accountAddress: AccountAddress,
    public message: string,
    public signature: Signature,
    public chain: EChain,
  ) {
    super(AddAccountWithExternalSignatureParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.ADD_ACCOUNT_WITH_EXTERNAL_SIGNATURE;
  }
}

export class AddAccountWithExternalTypedDataSignatureParams extends CoreActionParams<void> {
  public constructor(
    public accountAddress: AccountAddress,
    public domain: TypedDataDomain,
    public types: Record<string, Array<TypedDataField>>,
    public value: Record<string, unknown>,
    public signature: Signature,
    public chain: EChain,
  ) {
    super(AddAccountWithExternalTypedDataSignatureParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.ADD_ACCOUNT_WITH_EXTERNAL_TYPED_DATA_SIGNATURE;
  }
}

export class UnlinkAccountParams extends CoreActionParams<void> {
  public constructor(
    public accountAddress: AccountAddress,
    public chain: EChain,
  ) {
    super(UnlinkAccountParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.UNLINK_ACCOUNT;
  }
}

export class GetUnlockMessageParams extends CoreActionParams<string> {
  public constructor(public languageCode: LanguageCode) {
    super(GetUnlockMessageParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_UNLOCK_MESSAGE;
  }
}

export class SetGivenNameParams extends CoreActionParams<void> {
  public constructor(public givenName: GivenName) {
    super(SetGivenNameParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.SET_GIVEN_NAME;
  }
}

export class SetFamilyNameParams extends CoreActionParams<void> {
  public constructor(public familyName: FamilyName) {
    super(SetFamilyNameParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.SET_FAMILY_NAME;
  }
}

export class SetBirthdayParams extends CoreActionParams<void> {
  public constructor(public birthday: UnixTimestamp) {
    super(SetBirthdayParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.SET_BIRTHDAY;
  }
}

export class SetGenderParams extends CoreActionParams<void> {
  public constructor(public gender: Gender) {
    super(SetGenderParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.SET_GENDER;
  }
}

export class SetEmailParams extends CoreActionParams<void> {
  public constructor(public email: EmailAddressString) {
    super(SetEmailParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.SET_EMAIL;
  }
}

export class SetLocationParams extends CoreActionParams<void> {
  public constructor(public location: CountryCode) {
    super(SetLocationParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.SET_LOCATION;
  }
}

export class GetInvitationWithDomainParams extends CoreActionParams<JSONString | null> {
  public constructor(public domain: DomainName, public path: string) {
    super(GetInvitationWithDomainParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_COHORT_INVITATION_WITH_DOMAIN;
  }
}

export class UpdateAgreementPermissionsParams extends CoreActionParams<void> {
  public constructor(
    public consentContractAddress: EVMContractAddress,
    public dataTypes: EWalletDataType[],
  ) {
    super(UpdateAgreementPermissionsParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.UPDATE_AGREEMENT_PERMISSIONS;
  }
}

export class AcceptInvitationParams extends CoreActionParams<void> {
  public constructor(
    public invitation: JSONString,
    public dataTypes: EWalletDataType[] | null,
  ) {
    super(AcceptInvitationParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.ACCEPT_INVITATION;
  }
}

export class RejectInvitationParams extends CoreActionParams<void> {
  public constructor(
    public invitation: JSONString,
    public rejectUntil?: UnixTimestamp,
  ) {
    super(RejectInvitationParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.REJECT_INVITATION;
  }
}

export class GetAgreementPermissionsParams extends CoreActionParams<
  EWalletDataType[]
> {
  public constructor(public consentContractAddress: EVMContractAddress) {
    super(GetAgreementPermissionsParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_AGREEMENT_PERMISSIONS;
  }
}

export class LeaveCohortParams extends CoreActionParams<void> {
  public constructor(public consentContractAddress: EVMContractAddress) {
    super(LeaveCohortParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.LEAVE_COHORT;
  }
}

export class GetInvitationMetadataByCIDParams extends CoreActionParams<
  IOldUserAgreement | IUserAgreement
> {
  public constructor(public ipfsCID: IpfsCID) {
    super(GetInvitationMetadataByCIDParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_INVITATION_METADATA_BY_CID;
  }
}

export class GetMarketplaceListingsByTagParams extends CoreActionParams<
  PagedResponse<MarketplaceListing>
> {
  public constructor(
    public pagingReq: PagingRequest,
    public tag: MarketplaceTag,
    public filterActive?: boolean,
  ) {
    super(GetMarketplaceListingsByTagParams.getCoreAction());
  }

  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_MARKETPLACE_LISTINGS_BY_TAG;
  }
}

export class GetListingsTotalByTagParams extends CoreActionParams<number> {
  public constructor(public tag: MarketplaceTag) {
    super(GetListingsTotalByTagParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_LISTING_TOTAL_BY_TAG;
  }
}

export class GetConsentContractCIDParams extends CoreActionParams<IpfsCID> {
  public constructor(public consentAddress: EVMContractAddress) {
    super(GetConsentContractCIDParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_CONTRACT_CID;
  }
}

export class CheckInvitationStatusParams extends CoreActionParams<EInvitationStatus> {
  public constructor(
    public consentAddress: EVMContractAddress,
    public signature?: Signature | undefined,
    public tokenId?: BigNumberString | undefined,
  ) {
    super(CheckInvitationStatusParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.CHECK_INVITATION_STATUS;
  }
}

export class GetTokenPriceParams extends CoreActionParams<number> {
  public constructor(
    public chainId: ChainId,
    public address: TokenAddress | null,
    public timestamp?: UnixTimestamp,
  ) {
    super(GetTokenPriceParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_TOKEN_PRICE;
  }
}

export class GetTransactionsParams extends CoreActionParams<
  ChainTransaction[]
> {
  public constructor(public filter?: TransactionFilter) {
    super(GetTransactionsParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_TRANSACTIONS;
  }
}

export class GetTransactionValueByChainParams extends CoreActionParams<
  TransactionFlowInsight[]
> {
  public constructor() {
    super(GetTransactionValueByChainParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_TRANSACTION_VALUE_BY_CHAIN;
  }
}
export class GetConsentCapacityParams extends CoreActionParams<IConsentCapacity> {
  public constructor(public contractAddress: EVMContractAddress) {
    super(GetConsentCapacityParams.getCoreAction());
  }

  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_CONSENT_CAPACITY;
  }
}

export class GetPossibleRewardsParams extends CoreActionParams<JSONString> {
  public constructor(public contractAddresses: EVMContractAddress[]) {
    super(GetPossibleRewardsParams.getCoreAction());
  }

  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_EARNED_REWARDS_BY_CONTRACT_ADDRESS;
  }
}

export class GetTokenMarketDataParams extends CoreActionParams<
  TokenMarketData[]
> {
  public constructor(public ids: string[]) {
    super(GetTokenMarketDataParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_TOKEN_MARKET_DATA;
  }
}

export class GetTokenInfoParams extends CoreActionParams<TokenInfo | null> {
  public constructor(
    public chainId: ChainId,
    public contractAddress: TokenAddress | null,
  ) {
    super(GetTokenInfoParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_TOKEN_INFO;
  }
}

export class GetSiteVisitsMapParams extends CoreActionParams<JSONString> {
  public constructor() {
    super(GetSiteVisitsMapParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_SITE_VISITS_MAP;
  }
}

export class GetSiteVisitsParams extends CoreActionParams<SiteVisit[]> {
  public constructor() {
    super(GetSiteVisitsParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_SITE_VISITS;
  }
}

export class GetEarnedRewardsParams extends CoreActionParams<EarnedReward[]> {
  public constructor() {
    super(GetEarnedRewardsParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_EARNED_REWARDS;
  }
}

export class GetDataWalletAddressParams extends CoreActionParams<DataWalletAddress | null> {
  public constructor() {
    super(GetDataWalletAddressParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_DATA_WALLET_ADDRESS;
  }
}

export class IsDataWalletAddressInitializedParams extends CoreActionParams<boolean> {
  public constructor() {
    super(IsDataWalletAddressInitializedParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.IS_DATA_WALLET_ADDRESS_INITIALIZED;
  }
}

export class GetLocationParams extends CoreActionParams<CountryCode | null> {
  public constructor() {
    super(GetLocationParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_LOCATION;
  }
}

export class GetGenderParams extends CoreActionParams<Gender | null> {
  public constructor() {
    super(GetGenderParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_GENDER;
  }
}

export class GetEmailParams extends CoreActionParams<EmailAddressString | null> {
  public constructor() {
    super(GetEmailParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_EMAIL;
  }
}

export class GetBirthdayParams extends CoreActionParams<UnixTimestamp | null> {
  public constructor() {
    super(GetBirthdayParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_BIRTHDAY;
  }
}

export class GetGivenNameParams extends CoreActionParams<GivenName | null> {
  public constructor() {
    super(GetGivenNameParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_GIVEN_NAME;
  }
}

export class GetFamilyNameParams extends CoreActionParams<FamilyName | null> {
  public constructor() {
    super(GetFamilyNameParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_FAMILY_NAME;
  }
}

export class GetAgeParams extends CoreActionParams<Age | null> {
  public constructor() {
    super(GetAgeParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_AGE;
  }
}

export class GetAccountNFTsParams extends CoreActionParams<WalletNFT[]> {
  public constructor(
    public benchmark?: UnixTimestamp,
    public chains?: EChain[],
    public accounts?: LinkedAccount[],
  ) {
    super(GetAccountNFTsParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_ACCOUNT_NFTS;
  }
}

export class GetPersistenceNFTsParams extends CoreActionParams<
  WalletNFTData[]
> {
  public constructor() {
    super(GetPersistenceNFTsParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_ACCOUNT_PERSISTENCE_NFTS;
  }
}
export class GetAccountNFTHistoryParams extends CoreActionParams<
  WalletNFTHistory[]
> {
  public constructor() {
    super(GetAccountNFTHistoryParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_ACCOUNT_NFT_HISTORY;
  }
}

export class GetAccountNftCacheParams extends CoreActionParams<JSONString> {
  public constructor() {
    super(GetAccountNftCacheParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_ACCOUNT_NFT_CACHE;
  }
}

export class GetAccountBalancesParams extends CoreActionParams<TokenBalance[]> {
  public constructor() {
    super(GetAccountBalancesParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_ACCOUNT_BALANCES;
  }
}

export class GetAccountsParams extends CoreActionParams<LinkedAccount[]> {
  public constructor() {
    super(GetAccountsParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_ACCOUNTS;
  }
}

export class GetAcceptedInvitationsCIDParams extends CoreActionParams<JSONString> {
  public constructor() {
    super(GetAcceptedInvitationsCIDParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_ACCEPTED_INVITATIONS_CID;
  }
}

export class GetAvailableInvitationsCIDParams extends CoreActionParams<JSONString> {
  public constructor() {
    super(GetAvailableInvitationsCIDParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_AVAILABLE_INVITATIONS_CID;
  }
}

export class GetStateParams extends CoreActionParams<IExternalState> {
  public constructor() {
    super(GetStateParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_STATE;
  }
}

export class GetInternalStateParams extends CoreActionParams<IInternalState> {
  public constructor() {
    super(GetInternalStateParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_INTERNAL_STATE;
  }
}

export class SetDefaultReceivingAddressParams extends CoreActionParams<void> {
  public constructor(public receivingAddress: AccountAddress | null) {
    super(SetDefaultReceivingAddressParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.SET_DEFAULT_RECEIVING_ACCOUNT;
  }
}

export class SetReceivingAddressParams extends CoreActionParams<void> {
  public constructor(
    public contractAddress: EVMContractAddress,
    public receivingAddress: AccountAddress | null,
  ) {
    super(SetReceivingAddressParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.SET_RECEIVING_ACCOUNT;
  }
}

export class GetReceivingAddressParams extends CoreActionParams<AccountAddress> {
  public constructor(public contractAddress?: EVMContractAddress) {
    super(GetReceivingAddressParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_RECEIVING_ACCOUNT;
  }
}

export class InitializeDiscordUserParams extends CoreActionParams<void> {
  public constructor(public code: OAuthAuthorizationCode) {
    super(InitializeDiscordUserParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.INITIALIZE_DISCORD_USER;
  }
}

export class GetQueryStatusByCidParams extends CoreActionParams<QueryStatus | null> {
  public constructor(public queryCID: IpfsCID) {
    super(GetQueryStatusByCidParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_QUERY_STATUS_BY_CID;
  }
}

export class GetQueryStatusesParams extends CoreActionParams<QueryStatus[]> {
  public constructor(
    public contractAddress: EVMContractAddress,
    public blockNumber?: BlockNumber,
  ) {
    super(GetQueryStatusesParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_QUERY_STATUSES;
  }
}

export class GetDiscordInstallationUrlParams extends CoreActionParams<URLString> {
  public constructor() {
    super(GetDiscordInstallationUrlParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.INSTALLATION_DISCORD_URL;
  }
}

export class GetDiscordUserProfilesParams extends CoreActionParams<
  DiscordProfile[]
> {
  public constructor() {
    super(GetDiscordUserProfilesParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_DISCORD_USER_PROFILES;
  }
}

export class GetDiscordGuildProfilesParams extends CoreActionParams<
  DiscordGuildProfile[]
> {
  public constructor() {
    super(GetDiscordGuildProfilesParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_DISCORD_GUILD_PROFILES;
  }
}

export class UnlinkDiscordAccountParams extends CoreActionParams<void> {
  public constructor(public discordProfileId: DiscordID) {
    super(UnlinkDiscordAccountParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.UNLINK_DISCORD_ACCOUNT;
  }
}

export class TwitterGetRequestTokenParams extends CoreActionParams<TokenAndSecret> {
  public constructor() {
    super(TwitterGetRequestTokenParams.getCoreAction());
  }

  static getCoreAction(): ECoreActions {
    return ECoreActions.TWITTER_GET_REQUEST_TOKEN;
  }
}

export class TwitterLinkProfileParams extends CoreActionParams<TwitterProfile> {
  public constructor(
    public requestToken: OAuth1RequstToken,
    public oAuthVerifier: OAuthVerifier,
  ) {
    super(TwitterLinkProfileParams.getCoreAction());
  }

  static getCoreAction(): ECoreActions {
    return ECoreActions.TWITTER_LINK_PROFILE;
  }
}

export class TwitterUnlinkProfileParams extends CoreActionParams<void> {
  public constructor(public id: TwitterID) {
    super(TwitterUnlinkProfileParams.getCoreAction());
  }

  static getCoreAction(): ECoreActions {
    return ECoreActions.TWITTER_UNLINK_PROFILE;
  }
}

export class TwitterGetLinkedProfilesParams extends CoreActionParams<
  TwitterProfile[]
> {
  public constructor() {
    super(TwitterGetLinkedProfilesParams.getCoreAction());
  }

  static getCoreAction(): ECoreActions {
    return ECoreActions.TWITTER_GET_LINKED_PROFILES;
  }
}

export class GetMetricsParams extends CoreActionParams<RuntimeMetrics> {
  public constructor() {
    super(GetMetricsParams.getCoreAction());
  }

  static getCoreAction(): ECoreActions {
    return ECoreActions.METRICS_GET_METRICS;
  }
}

export class GetConfigParams extends CoreActionParams<IExtensionConfig> {
  public constructor() {
    super(GetConfigParams.getCoreAction());
  }

  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_CONFIG;
  }
}

export class GetConsentContractURLsParams extends CoreActionParams<
  URLString[]
> {
  public constructor(public contractAddress: EVMContractAddress) {
    super(GetConsentContractURLsParams.getCoreAction());
  }

  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_CONSENT_CONTRACT_URLS;
  }
}

// #region Integration
export class RequestPermissionsParams extends CoreActionParams<
  EDataWalletPermission[]
> {
  public constructor(public permissions: EDataWalletPermission[]) {
    super(RequestPermissionsParams.getCoreAction());
  }

  static getCoreAction(): ECoreActions {
    return ECoreActions.REQUEST_PERMISSIONS;
  }
}

export class GetPermissionsParams extends CoreActionParams<
  EDataWalletPermission[]
> {
  public constructor(public domain: DomainName) {
    super(GetPermissionsParams.getCoreAction());
  }

  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_PERMISSIONS;
  }
}

export class GetTokenVerificationPublicKeyParams extends CoreActionParams<PEMEncodedRSAPublicKey> {
  public constructor(public domain: DomainName) {
    super(GetTokenVerificationPublicKeyParams.getCoreAction());
  }

  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_TOKEN_VERIFICATION_PUBLIC_KEY;
  }
}

export class GetBearerTokenParams extends CoreActionParams<JsonWebToken> {
  public constructor(public nonce: string, public domain: DomainName) {
    super(GetBearerTokenParams.getCoreAction());
  }

  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_BEARER_TOKEN;
  }
}

export class GetDropBoxAuthUrlParams extends CoreActionParams<URLString> {
  public constructor() {
    super(GetDropBoxAuthUrlParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_DROPBOX_AUTH_URL;
  }
}
export class SetAuthenticatedStorageParams extends CoreActionParams<void> {
  public constructor(
    public storageType: ECloudStorageType,
    public path: string,
    public refreshToken: RefreshToken,
  ) {
    super(SetAuthenticatedStorageParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.SET_AUTHENTICATED_STORAGE;
  }
}

export class AuthenticateDropboxParams extends CoreActionParams<OAuth2Tokens> {
  public constructor(public code: string) {
    super(AuthenticateDropboxParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.AUTHENTICATE_DROPBOX;
  }
}

export class GetAvailableCloudStorageOptionsParams extends CoreActionParams<
  Set<ECloudStorageType>
> {
  public constructor() {
    super(GetAvailableCloudStorageOptionsParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_AVAILABLE_CLOUD_STORAGE_OPTIONS;
  }
}

export class GetCurrentCloudStorageParams extends CoreActionParams<ECloudStorageType> {
  public constructor() {
    super(GetCurrentCloudStorageParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_CURRENT_STORAGE_TYPE;
  }
}

// #endregion

// #region Scraper
export class ScraperScrapeParams extends CoreActionParams<void> {
  public constructor(
    public url: URLString,
    public html: HTMLString,
    public suggestedDomainTask: DomainTask,
  ) {
    super(ScraperScrapeParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.SCRAPER_SCRAPE_PARAMS;
  }
}

export class ScraperClassifyUrlParams extends CoreActionParams<DomainTask> {
  public constructor(public url: URLString, public language: ELanguageCode) {
    super(ScraperClassifyUrlParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.SCRAPER_CLASSIFY_URL_PARAMS;
  }
}
// #endregion

// #region Scraper Navigation

export class ScraperGetOrderHistoryPageParams extends CoreActionParams<URLString> {
  public constructor(public lang: ELanguageCode, public page: PageNumber) {
    super(ScraperGetOrderHistoryPageParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.SCRAPER_NAVIGATION_GET_ORDER_HISTORY_PAGE_PARAMS;
  }
}

export class ScraperGetYearsParams extends CoreActionParams<Year[]> {
  public constructor(public html: HTMLString) {
    super(ScraperGetYearsParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.SCRAPER_NAVIGATION_GET_YEARS_PARAMS;
  }
}

export class ScraperGetOrderHistoryPageByYearParams extends CoreActionParams<URLString> {
  public constructor(
    public lang: ELanguageCode,
    public year: Year,
    public page: PageNumber,
  ) {
    super(ScraperGetOrderHistoryPageByYearParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.SCRAPER_NAVIGATION_GET_ORDER_HISTORY_PAGE_BY_YEAR_PARAMS;
  }
}
export class ScraperGetPageCountParams extends CoreActionParams<number> {
  public constructor(public html: HTMLString, public year: Year) {
    super(ScraperGetPageCountParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.SCRAPER_NAVIGATION_GET_PAGE_COUNT_PARAMS;
  }
}

// #endregion

// #region Purchase
export class PurchaseGetPurchasedProductsParams extends CoreActionParams<
  PurchasedProduct[]
> {
  public constructor() {
    super(PurchaseGetPurchasedProductsParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.PURCHASE_GET_PURCHASED_PRODUCTS_PARAMS;
  }
}

export class PurchaseGetByMarketPlaceParams extends CoreActionParams<
  PurchasedProduct[]
> {
  public constructor(public marketPlace: DomainName) {
    super(PurchaseGetByMarketPlaceParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.PURCHASE_GET_BY_MARKET_PLACE;
  }
}

export class PurchaseGetByMarketPlaceAndDateParams extends CoreActionParams<
  PurchasedProduct[]
> {
  public constructor(
    public marketPlace: DomainName,
    public datePurchased: UnixTimestamp,
  ) {
    super(PurchaseGetByMarketPlaceAndDateParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.PURCHASE_GET_BY_MARKET_PLACE_AND_DATE;
  }
}

export class PurchaseGetShoppingDataConnectionStatusParams extends CoreActionParams<
  ShoppingDataConnectionStatus[]
> {
  public constructor() {
    super(PurchaseGetShoppingDataConnectionStatusParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.PURCHASE_GET_SHOPPINGDATA_CONNECTION_STATUS;
  }
}
export class PurchaseSetShoppingDataConnectionStatusParams extends CoreActionParams<void> {
  public constructor(
    public ShoppingDataConnectionStatus: ShoppingDataConnectionStatus,
  ) {
    super(PurchaseSetShoppingDataConnectionStatusParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.PURCHASE_SET_SHOPPINGDATA_CONNECTION_STATUS;
  }
}
// #endregion
