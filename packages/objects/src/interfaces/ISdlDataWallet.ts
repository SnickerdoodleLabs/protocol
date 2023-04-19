import { EventEmitter } from "events";

import { ResultAsync } from "neverthrow";

import {
  DiscordGuildProfile,
  DiscordProfile,
  EarnedReward,
  ITokenAndSecret,
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
} from "@objects/businessObjects";
import { EChain, EInvitationStatus, EWalletDataType } from "@objects/enum";
import { IConsentCapacity } from "@objects/interfaces//IConsentCapacity";
import { IOpenSeaMetadata } from "@objects/interfaces/IOpenSeaMetadata";
import { IScamFilterPreferences } from "@objects/interfaces/IScamFilterPreferences";
import {
  AccountAddress,
  Age,
  BearerAuthToken,
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
  Signature,
  TwitterID,
  UnixTimestamp,
  URLString,
} from "@objects/primitives";

type JsonRpcError = unknown;
export interface ISdlDataWallet extends EventEmitter {
  unlock(
    accountAddress: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode?: LanguageCode,
  ): ResultAsync<void, JsonRpcError>;
  addAccount: (
    accountAddress: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode?: LanguageCode,
  ) => ResultAsync<void, JsonRpcError>;
  getUnlockMessage: (
    languageCode?: LanguageCode,
  ) => ResultAsync<string, JsonRpcError>;
  getAge(): ResultAsync<Age | null, JsonRpcError>;
  setGivenName(givenName: GivenName): ResultAsync<void, JsonRpcError>;
  getGivenName(): ResultAsync<GivenName | null, JsonRpcError>;
  setFamilyName(familyName: FamilyName): ResultAsync<void, JsonRpcError>;
  getFamilyName(): ResultAsync<FamilyName | null, JsonRpcError>;
  setBirthday(birthday: UnixTimestamp): ResultAsync<void, JsonRpcError>;
  getBirthday(): ResultAsync<UnixTimestamp | null, JsonRpcError>;
  setGender(gender: Gender): ResultAsync<void, JsonRpcError>;
  getGender(): ResultAsync<Gender | null, JsonRpcError>;
  setEmail(email: EmailAddressString): ResultAsync<void, JsonRpcError>;
  getEmail(): ResultAsync<EmailAddressString | null, JsonRpcError>;
  setLocation(location: CountryCode): ResultAsync<void, JsonRpcError>;
  getLocation(): ResultAsync<CountryCode | null, JsonRpcError>;
  getAccounts(): ResultAsync<LinkedAccount[], JsonRpcError>;
  getTokenPrice(
    chainId: ChainId,
    address: TokenAddress | null,
    timestamp?: UnixTimestamp,
  ): ResultAsync<number, JsonRpcError>;
  getTokenMarketData(
    ids: string[],
  ): ResultAsync<TokenMarketData[], JsonRpcError>;

  getTokenInfo(
    chainId: ChainId,
    contractAddress: TokenAddress | null,
  ): ResultAsync<TokenInfo | null, JsonRpcError>;
  getAccountBalances(): ResultAsync<TokenBalance[], JsonRpcError>;
  getAccountNFTs(): ResultAsync<WalletNFT[], JsonRpcError>;
  closeTab(): ResultAsync<void, JsonRpcError>;
  getDataWalletAddress(): ResultAsync<DataWalletAddress | null, JsonRpcError>;
  getAcceptedInvitationsCID(): ResultAsync<
    Record<EVMContractAddress, IpfsCID>,
    JsonRpcError
  >;
  getAvailableInvitationsCID(): ResultAsync<
    Record<EVMContractAddress, IpfsCID>,
    JsonRpcError
  >;
  getInvitationMetadataByCID(
    ipfsCID: IpfsCID,
  ): ResultAsync<IOpenSeaMetadata, JsonRpcError>;
  getAgreementPermissions(
    consentContractAddres: EVMContractAddress,
  ): ResultAsync<EWalletDataType[], JsonRpcError>;
  getApplyDefaultPermissionsOption(): ResultAsync<boolean, JsonRpcError>;
  setApplyDefaultPermissionsOption(
    option: boolean,
  ): ResultAsync<boolean, JsonRpcError>;
  getDefaultPermissions(): ResultAsync<EWalletDataType[], JsonRpcError>;
  setDefaultPermissions(
    dataTypes: EWalletDataType[],
  ): ResultAsync<void, JsonRpcError>;
  getScamFilterSettings(): ResultAsync<IScamFilterPreferences, JsonRpcError>;
  setScamFilterSettings(
    isScamFilterActive: boolean,
    showMessageEveryTime: boolean,
  ): ResultAsync<void, JsonRpcError>;
  setDefaultPermissionsToAll(): ResultAsync<void, JsonRpcError>;
  acceptInvitation(
    dataTypes: EWalletDataType[] | null,
    consentContractAddress: EVMContractAddress,
    tokenId?: BigNumberString,
    businessSignature?: Signature,
  ): ResultAsync<void, JsonRpcError>;
  leaveCohort(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<void, JsonRpcError>;
  unlinkAcccount(
    accountAddress: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode?: LanguageCode,
  ): ResultAsync<void, JsonRpcError>;

  checkInvitationStatus(
    consentAddress: EVMContractAddress,
    signature?: Signature,
    tokenId?: BigNumberString,
  ): ResultAsync<EInvitationStatus, JsonRpcError>;

  getConsentContractCID(
    consentAddress: EVMContractAddress,
  ): ResultAsync<IpfsCID, JsonRpcError>;

  getEarnedRewards(): ResultAsync<EarnedReward[], JsonRpcError>;

  getSiteVisits(): ResultAsync<SiteVisit[], JsonRpcError>;

  getSiteVisitsMap(): ResultAsync<Record<URLString, number>, JsonRpcError>;

  getMarketplaceListingsByTag(
    pagingReq: PagingRequest,
    tag: MarketplaceTag,
    filterActive?: boolean,
  ): ResultAsync<PagedResponse<MarketplaceListing>, JsonRpcError>;

  getListingsTotalByTag(tag: MarketplaceTag): ResultAsync<number, JsonRpcError>;

  setDefaultReceivingAddress(
    receivingAddress: AccountAddress | null,
  ): ResultAsync<void, JsonRpcError>;

  setReceivingAddress(
    contractAddress: EVMContractAddress,
    receivingAddress: AccountAddress | null,
  ): ResultAsync<void, JsonRpcError>;

  getReceivingAddress(
    contractAddress?: EVMContractAddress,
  ): ResultAsync<AccountAddress, JsonRpcError>;

  getConsentCapacity(
    contractAddress: EVMContractAddress,
  ): ResultAsync<IConsentCapacity, JsonRpcError>;

  getPossibleRewards(
    contractAddresses: EVMContractAddress[],
    timeoutMs?: number,
  ): ResultAsync<Record<EVMContractAddress, PossibleReward[]>, JsonRpcError>;

  discord: ISdlDiscordMethods;
  twitter: ISdlTwitterMethods;
}

export interface ISdlDiscordMethods {
  /**
   * This method will upsert a users discord profile and
   * discord guild data given a token which will come from discord api
   * @param authToken
   */
  initializeUserWithAuthorizationCode(
    code: OAuthAuthorizationCode,
  ): ResultAsync<void, JsonRpcError>;

  /**
   * This method will return url for the discord api
   * call to be made. If user gives consent token can be used
   * to initialize the user
   */
  installationUrl(): ResultAsync<URLString, JsonRpcError>;

  getUserProfiles(): ResultAsync<DiscordProfile[], JsonRpcError>;
  getGuildProfiles(): ResultAsync<DiscordGuildProfile[], JsonRpcError>;
  /**
   * This method will remove a users discord profile and
   * discord guild data given their profile id
   * @param discordProfileId
   */
  unlink(discordProfileId: DiscordID): ResultAsync<void, JsonRpcError>;
}

export interface ISdlTwitterMethods {
  getOAuth1aRequestToken(): ResultAsync<ITokenAndSecret, JsonRpcError>;
  initTwitterProfile(
    requestToken: BearerAuthToken,
    oAuthVerifier: string,
  ): ResultAsync<TwitterProfile, JsonRpcError>;
  unlinkProfile(id: TwitterID): ResultAsync<void, JsonRpcError>;
  getUserProfiles(): ResultAsync<TwitterProfile[], JsonRpcError>;
}
