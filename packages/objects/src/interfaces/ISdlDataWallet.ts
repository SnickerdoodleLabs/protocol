import { ResultAsync } from "neverthrow";
import { FunctionKeys } from "utility-types";

import {
  EarnedReward,
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
  WalletNFT,
} from "@objects/businessObjects/index.js";
import {
  EChain,
  EDataWalletPermission,
  EInvitationStatus,
  EWalletDataType,
} from "@objects/enum/index.js";
import { PersistenceError, ProxyError } from "@objects/errors/index.js";
import { IConsentCapacity } from "@objects/interfaces//IConsentCapacity.js";
import { IOpenSeaMetadata } from "@objects/interfaces/IOpenSeaMetadata.js";
import { IScamFilterPreferences } from "@objects/interfaces/IScamFilterPreferences.js";
import {
  ICoreDiscordMethods,
  ICoreIntegrationMethods,
  ICoreTwitterMethods,
  IMetricsMethods,
} from "@objects/interfaces/ISnickerdoodleCore.js";
import { ISnickerdoodleCoreEvents } from "@objects/interfaces/ISnickerdoodleCoreEvents.js";
import {
  AccountAddress,
  Age,
  BigNumberString,
  ChainId,
  CountryCode,
  DataWalletAddress,
  DomainName,
  EmailAddressString,
  EVMContractAddress,
  FamilyName,
  Gender,
  GivenName,
  IpfsCID,
  LanguageCode,
  MarketplaceTag,
  Signature,
  UnixTimestamp,
  URLString,
} from "@objects/primitives/index.js";
import { GetResultAsyncValueType, PopTuple } from "@objects/types.js";

// export type IProxyAccountMethods = {
//   [key in FunctionKeys<IAccountMethods>]: (
//     ...args: [...Exclude<Parameters<IAccountMethods[key]>, "sourceDomain">]
//   ) => ResultAsync<
//     GetResultAsyncValueType<ReturnType<IAccountMethods[key]>>,
//     ProxyError
//   >;
// };

// export type IProxyInvitationMethods = {
//   [key in FunctionKeys<IInvitationMethods>]: (
//     ...args: [...Exclude<Parameters<IInvitationMethods[key]>, "sourceDomain">]
//   ) => ResultAsync<
//     GetResultAsyncValueType<ReturnType<IInvitationMethods[key]>>,
//     ProxyError
//   >;
// };

// export type IProxyMarketplaceMethods = {
//   [key in FunctionKeys<ICoreMarketplaceMethods>]: (
//     ...args: [
//       ...Exclude<Parameters<ICoreMarketplaceMethods[key]>, "sourceDomain">,
//     ]
//   ) => ResultAsync<
//     GetResultAsyncValueType<ReturnType<ICoreMarketplaceMethods[key]>>,
//     ProxyError
//   >;
// };

// export type IProxyIntegrationMethods = {
//   [key in FunctionKeys<ICoreIntegrationMethods>]: (
//     ...args: [
//       ...Exclude<Parameters<ICoreIntegrationMethods[key]>, "sourceDomain">,
//     ]
//   ) => ResultAsync<
//     GetResultAsyncValueType<ReturnType<ICoreIntegrationMethods[key]>>,
//     ProxyError
//   >;
// };

export type IProxyDiscordMethods = {
  [key in FunctionKeys<ICoreDiscordMethods>]: (
    ...args: [...PopTuple<Parameters<ICoreDiscordMethods[key]>>]
  ) => ResultAsync<
    GetResultAsyncValueType<ReturnType<ICoreDiscordMethods[key]>>,
    ProxyError
  >;
};

export type IProxyIntegrationMethods = {
  [key in Exclude<
    FunctionKeys<ICoreIntegrationMethods>,
    | "grantPermissions"
    | "revokePermissions" // These methods should not exist on the proxy!
    | "requestPermissions"
    | "getPermissions" // These methods need special handling
  >]: (
    ...args: [...Parameters<ICoreIntegrationMethods[key]>]
  ) => ResultAsync<
    GetResultAsyncValueType<ReturnType<ICoreIntegrationMethods[key]>>,
    ProxyError
  >;
} & {
  requestPermissions(
    ...args: [
      ...PopTuple<Parameters<ICoreIntegrationMethods["requestPermissions"]>>,
    ]
  ): ResultAsync<
    GetResultAsyncValueType<
      ReturnType<ICoreIntegrationMethods["requestPermissions"]>
    >,
    ProxyError
  >;

  getPermissions(
    ...args: [
      ...PopTuple<Parameters<ICoreIntegrationMethods["getPermissions"]>>,
    ]
  ): ResultAsync<
    GetResultAsyncValueType<
      ReturnType<ICoreIntegrationMethods["getPermissions"]>
    >,
    ProxyError
  >;
};

export type IProxyMetricsMethods = {
  [key in FunctionKeys<IMetricsMethods>]: (
    ...args: [...PopTuple<Parameters<IMetricsMethods[key]>>]
  ) => ResultAsync<
    GetResultAsyncValueType<ReturnType<IMetricsMethods[key]>>,
    ProxyError
  >;
};

export type IProxyTwitterMethods = {
  [key in FunctionKeys<ICoreTwitterMethods>]: (
    ...args: [...PopTuple<Parameters<ICoreTwitterMethods[key]>>]
  ) => ResultAsync<
    GetResultAsyncValueType<ReturnType<ICoreTwitterMethods[key]>>,
    ProxyError
  >;
};

// This stuff is left in for reference- I'm still working on improving these
// methods and
// type test = Parameters<ICoreIntegrationMethods["requestPermissions"]>;
// type test2 = Exclude<test, "sourceDomain">;
// type test3 = Omit<test, "sourceDomain">;
// type test4 = PopTuple<test>;
// type test5 = Parameters<
//   ICoreDiscordMethods["initializeUserWithAuthorizationCode"]
// >;
// type test6 = PopTuple<
//   Parameters<ICoreDiscordMethods["initializeUserWithAuthorizationCode"]>
// >;

// export type IBaseProxyMethods = {
//   [key in FunctionKeys<ISnickerdoodleCore>]: (
//     ...args: [...Exclude<Parameters<ISnickerdoodleCore[key]>, "sourceDomain">]
//   ) => ResultAsync<
//     GetResultAsyncValueType<ReturnType<ISnickerdoodleCore[key]>>,
//     ProxyError
//   >;
// };

// export type ISdlDataWallet = IBaseProxyMethods & {
//   account: IProxyAccountMethods;
//   invitation: IProxyInvitationMethods;
//   marketplace: IProxyMarketplaceMethods;
//   integration: IProxyIntegrationMethods;
//   discord: IProxyDiscordMethods;
//   twitter: IProxyTwitterMethods;
//   metrics: IProxyMetricsMethods;

//   events: ISnickerdoodleCoreEvents;
// };

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

  discord: IProxyDiscordMethods;
  integration: IProxyIntegrationMethods;
  twitter: IProxyTwitterMethods;
  metrics: IProxyMetricsMethods;

  events: ISnickerdoodleCoreEvents;
}
