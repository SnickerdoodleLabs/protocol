import { EventEmitter } from "events";

import { ResultAsync } from "neverthrow";

import {
  DiscordGuildProfile,
  DiscordProfile,
  EarnedReward,
  TokenAndSecret,
  LinkedAccount,
  MarketplaceListing,
  PagedResponse,
  PagingRequest,
  PossibleReward,
  SiteVisit,
  TokenAddress,
  TokenBalance,
  TokenInfo,
  TokenMarketData,
  TwitterProfile,
  WalletNFT,
  RuntimeMetrics,
} from "@objects/businessObjects/index.js";
import {
  EChain,
  EInvitationStatus,
  EWalletDataType,
} from "@objects/enum/index.js";
import { ProxyError } from "@objects/errors/index.js";
import { IConsentCapacity } from "@objects/interfaces//IConsentCapacity.js";
import { IOpenSeaMetadata } from "@objects/interfaces/IOpenSeaMetadata.js";
import { IScamFilterPreferences } from "@objects/interfaces/IScamFilterPreferences.js";
import { ISnickerdoodleCoreEvents } from "@objects/interfaces/ISnickerdoodleCoreEvents.js";
import {
  AccountAddress,
  Age,
  OAuth1RequstToken,
  BigNumberString,
  ChainId,
  CountryCode,
  DataWalletAddress,
  DiscordID,
  EmailAddressString,
  EVMContractAddress,
  FamilyName,
  Gender,
  GivenName,
  IpfsCID,
  LanguageCode,
  MarketplaceTag,
  OAuthAuthorizationCode,
  OAuthVerifier,
  Signature,
  TwitterID,
  UnixTimestamp,
  URLString,
} from "@objects/primitives/index.js";

export interface ISdlDataWallet {
  unlock(
    accountAddress: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode?: LanguageCode,
  ): ResultAsync<void, ProxyError>;
  addAccount(
    accountAddress: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode?: LanguageCode,
  ): ResultAsync<void, ProxyError>;
  getUnlockMessage(
    languageCode?: LanguageCode,
  ): ResultAsync<string, ProxyError>;
  getAge(): ResultAsync<Age | null, ProxyError>;
  setGivenName(givenName: GivenName): ResultAsync<void, ProxyError>;
  getGivenName(): ResultAsync<GivenName | null, ProxyError>;
  setFamilyName(familyName: FamilyName): ResultAsync<void, ProxyError>;
  getFamilyName(): ResultAsync<FamilyName | null, ProxyError>;
  setBirthday(birthday: UnixTimestamp): ResultAsync<void, ProxyError>;
  getBirthday(): ResultAsync<UnixTimestamp | null, ProxyError>;
  setGender(gender: Gender): ResultAsync<void, ProxyError>;
  getGender(): ResultAsync<Gender | null, ProxyError>;
  setEmail(email: EmailAddressString): ResultAsync<void, ProxyError>;
  getEmail(): ResultAsync<EmailAddressString | null, ProxyError>;
  setLocation(location: CountryCode): ResultAsync<void, ProxyError>;
  getLocation(): ResultAsync<CountryCode | null, ProxyError>;
  getAccounts(): ResultAsync<LinkedAccount[], ProxyError>;
  getTokenPrice(
    chainId: ChainId,
    address: TokenAddress | null,
    timestamp: UnixTimestamp,
  ): ResultAsync<number, ProxyError>;
  getTokenMarketData(ids: string[]): ResultAsync<TokenMarketData[], ProxyError>;

  getTokenInfo(
    chainId: ChainId,
    contractAddress: TokenAddress | null,
  ): ResultAsync<TokenInfo | null, ProxyError>;
  getAccountBalances(): ResultAsync<TokenBalance[], ProxyError>;
  getAccountNFTs(): ResultAsync<WalletNFT[], ProxyError>;
  closeTab(): ResultAsync<void, ProxyError>;
  getDataWalletAddress(): ResultAsync<DataWalletAddress | null, ProxyError>;
  getAcceptedInvitationsCID(): ResultAsync<
    Record<EVMContractAddress, IpfsCID>,
    ProxyError
  >;
  getAvailableInvitationsCID(): ResultAsync<
    Record<EVMContractAddress, IpfsCID>,
    ProxyError
  >;
  getInvitationMetadataByCID(
    ipfsCID: IpfsCID,
  ): ResultAsync<IOpenSeaMetadata, ProxyError>;
  getAgreementPermissions(
    consentContractAddres: EVMContractAddress,
  ): ResultAsync<EWalletDataType[], ProxyError>;
  getApplyDefaultPermissionsOption(): ResultAsync<boolean, ProxyError>;
  setApplyDefaultPermissionsOption(
    option: boolean,
  ): ResultAsync<void, ProxyError>;
  getDefaultPermissions(): ResultAsync<EWalletDataType[], ProxyError>;
  setDefaultPermissions(
    dataTypes: EWalletDataType[],
  ): ResultAsync<void, ProxyError>;
  getScamFilterSettings(): ResultAsync<IScamFilterPreferences, ProxyError>;
  setScamFilterSettings(
    isScamFilterActive: boolean,
    showMessageEveryTime: boolean,
  ): ResultAsync<void, ProxyError>;
  setDefaultPermissionsToAll(): ResultAsync<void, ProxyError>;
  acceptInvitation(
    dataTypes: EWalletDataType[] | null,
    consentContractAddress: EVMContractAddress,
    tokenId?: BigNumberString,
    businessSignature?: Signature,
  ): ResultAsync<void, ProxyError>;
  leaveCohort(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<void, ProxyError>;
  unlinkAcccount(
    accountAddress: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode?: LanguageCode,
  ): ResultAsync<void, ProxyError>;

  checkInvitationStatus(
    consentAddress: EVMContractAddress,
    signature?: Signature,
    tokenId?: BigNumberString,
  ): ResultAsync<EInvitationStatus, ProxyError>;

  getConsentContractCID(
    consentAddress: EVMContractAddress,
  ): ResultAsync<IpfsCID, ProxyError>;

  getEarnedRewards(): ResultAsync<EarnedReward[], ProxyError>;

  getSiteVisits(): ResultAsync<SiteVisit[], ProxyError>;

  getSiteVisitsMap(): ResultAsync<Map<URLString, number>, ProxyError>;

  getMarketplaceListingsByTag(
    pagingReq: PagingRequest,
    tag: MarketplaceTag,
    filterActive?: boolean,
  ): ResultAsync<PagedResponse<MarketplaceListing>, ProxyError>;

  getListingsTotalByTag(tag: MarketplaceTag): ResultAsync<number, ProxyError>;

  setDefaultReceivingAddress(
    receivingAddress: AccountAddress | null,
  ): ResultAsync<void, ProxyError>;

  setReceivingAddress(
    contractAddress: EVMContractAddress,
    receivingAddress: AccountAddress | null,
  ): ResultAsync<void, ProxyError>;

  getReceivingAddress(
    contractAddress?: EVMContractAddress,
  ): ResultAsync<AccountAddress, ProxyError>;

  getConsentCapacity(
    contractAddress: EVMContractAddress,
  ): ResultAsync<IConsentCapacity, ProxyError>;

  getPossibleRewards(
    contractAddresses: EVMContractAddress[],
    timeoutMs?: number,
  ): ResultAsync<Record<EVMContractAddress, PossibleReward[]>, ProxyError>;

  switchToTab(tabId: number): ResultAsync<void, ProxyError>;

  discord: ISdlDiscordMethods;
  twitter: ISdlTwitterMethods;
  metrics: IProxyMetricsMethods;

  events: ISnickerdoodleCoreEvents;
}

export interface ISdlDiscordMethods {
  /**
   * This method will upsert a users discord profile and
   * discord guild data given a token which will come from discord api
   * @param authToken
   */
  initializeUserWithAuthorizationCode(
    code: OAuthAuthorizationCode,
  ): ResultAsync<void, ProxyError>;

  /**
   * This method will return url for the discord api
   * call to be made. If user gives consent token can be used
   * to initialize the user
   */
  installationUrl(
    attachRedirectTabId?: boolean,
  ): ResultAsync<URLString, ProxyError>;

  getUserProfiles(): ResultAsync<DiscordProfile[], ProxyError>;
  getGuildProfiles(): ResultAsync<DiscordGuildProfile[], ProxyError>;
  /**
   * This method will remove a users discord profile and
   * discord guild data given their profile id
   * @param discordProfileId
   */
  unlink(discordProfileId: DiscordID): ResultAsync<void, ProxyError>;
}

export interface ISdlTwitterMethods {
  getOAuth1aRequestToken(): ResultAsync<TokenAndSecret, ProxyError>;
  initTwitterProfile(
    requestToken: OAuth1RequstToken,
    oAuthVerifier: OAuthVerifier,
  ): ResultAsync<TwitterProfile, ProxyError>;
  unlinkProfile(id: TwitterID): ResultAsync<void, ProxyError>;
  getUserProfiles(): ResultAsync<TwitterProfile[], ProxyError>;
}

export interface IProxyMetricsMethods {
  getMetrics(): ResultAsync<RuntimeMetrics, ProxyError>;
  getUnlocked(): ResultAsync<boolean, ProxyError>;
}
