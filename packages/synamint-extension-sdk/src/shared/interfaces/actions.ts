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
  IOpenSeaMetadata,
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
  PossibleReward,
  OAuth1RequstToken,
  OAuthVerifier,
  TwitterID,
  TwitterProfile,
  TokenAndSecret,
  QueryStatus,
} from "@snickerdoodlelabs/objects";

import {
  ECoreActions,
  IExternalState,
  IInternalState,
  IInvitationDomainWithUUID,
  IScamFilterPreferences,
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

export class UnlinkAccountParams extends CoreActionParams<void> {
  public constructor(
    public accountAddress: AccountAddress,
    public signature: Signature,
    public chain: EChain,
    public languageCode: LanguageCode,
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

export class SetApplyDefaultPermissionsParams extends CoreActionParams<void> {
  public constructor(public option: boolean) {
    super(SetApplyDefaultPermissionsParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.SET_APPLY_DEFAULT_PERMISSIONS_OPTION;
  }
}

export class GetInvitationWithDomainParams extends CoreActionParams<IInvitationDomainWithUUID | null> {
  public constructor(public domain: DomainName, public path: string) {
    super(GetInvitationWithDomainParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_COHORT_INVITATION_WITH_DOMAIN;
  }
}

export class AcceptInvitationByUUIDParams extends CoreActionParams<void> {
  public constructor(public dataTypes: EWalletDataType[], public id: UUID) {
    super(AcceptInvitationByUUIDParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.ACCEPT_INVITATION_BY_UUID;
  }
}

export class AcceptInvitationParams extends CoreActionParams<void> {
  public constructor(
    public dataTypes: EWalletDataType[],
    public consentContractAddress: EVMContractAddress,
    public tokenId?: BigNumberString,
    public businessSignature?: Signature,
  ) {
    super(AcceptInvitationParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.ACCEPT_INVITATION;
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

export class SetDefaultPermissionsWithDataTypesParams extends CoreActionParams<void> {
  public constructor(public dataTypes: EWalletDataType[]) {
    super(SetDefaultPermissionsWithDataTypesParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.SET_DEFAULT_PERMISSIONS;
  }
}

export class RejectInvitationParams extends CoreActionParams<void> {
  public constructor(public id: UUID) {
    super(RejectInvitationParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.REJECT_INVITATION;
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

export class GetInvitationMetadataByCIDParams extends CoreActionParams<IOpenSeaMetadata> {
  public constructor(public ipfsCID: IpfsCID) {
    super(GetInvitationMetadataByCIDParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_INVITATION_METADATA_BY_CID;
  }
}

export class CheckURLParams extends CoreActionParams<string> {
  public constructor(public domain: DomainName) {
    super(CheckURLParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.CHECK_URL;
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

export class ScamFilterSettingsParams extends CoreActionParams<void> {
  public constructor(
    public isScamFilterActive: boolean,
    public showMessageEveryTime: boolean,
  ) {
    super(ScamFilterSettingsParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.SET_SCAM_FILTER_SETTINGS;
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

export class GetConsentCapacityParams extends CoreActionParams<IConsentCapacity> {
  public constructor(public contractAddress: EVMContractAddress) {
    super(GetConsentCapacityParams.getCoreAction());
  }

  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_CONSENT_CAPACITY;
  }
}

export class GetPossibleRewardsParams extends CoreActionParams<
  Record<EVMContractAddress, PossibleReward[]>
> {
  public constructor(
    public contractAddresses: EVMContractAddress[],
    public timeoutMs?: number,
  ) {
    super(GetPossibleRewardsParams.getCoreAction());
  }

  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_POSSIBLE_REWARDS;
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

export class CloseTabParams extends CoreActionParams<void> {
  public constructor() {
    super(CloseTabParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.CLOSE_TAB;
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
  public constructor() {
    super(GetAccountNFTsParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_ACCOUNT_NFTS;
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

export class GetApplyDefaultPermissionsOptionParams extends CoreActionParams<boolean> {
  public constructor() {
    super(GetApplyDefaultPermissionsOptionParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_APPLY_DEFAULT_PERMISSIONS_OPTION;
  }
}

export class GetAcceptedInvitationsCIDParams extends CoreActionParams<
  Record<EVMContractAddress, IpfsCID>
> {
  public constructor() {
    super(GetAcceptedInvitationsCIDParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_ACCEPTED_INVITATIONS_CID;
  }
}

export class GetScamFilterSettingsParams extends CoreActionParams<IScamFilterPreferences> {
  public constructor() {
    super(GetScamFilterSettingsParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_SCAM_FILTER_SETTINGS;
  }
}

export class SetDefaultPermissionsToAllParams extends CoreActionParams<void> {
  public constructor() {
    super(SetDefaultPermissionsToAllParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.SET_DEFAULT_PERMISSIONS_TO_ALL;
  }
}

export class GetDefaultPermissionsParams extends CoreActionParams<
  EWalletDataType[]
> {
  public constructor() {
    super(GetDefaultPermissionsParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_DEFAULT_PERMISSIONS;
  }
}

export class GetAvailableInvitationsCIDParams extends CoreActionParams<
  Record<EVMContractAddress, IpfsCID>
> {
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

export class GetQueryStatusByQueryCIDParams extends CoreActionParams<QueryStatus | null> {
  public constructor(public cid: IpfsCID) {
    super(GetQueryStatusByQueryCIDParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_QUERY_STATUS_BY_QUERY_CID;
  }
}

export class GetSupportedChainIDsParams extends CoreActionParams<ChainId[]> {
  public constructor() {
    super(GetSupportedChainIDsParams.getCoreAction());
  }
  static getCoreAction(): ECoreActions {
    return ECoreActions.GET_SUPPORTED_CHAIN_IDS;
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
