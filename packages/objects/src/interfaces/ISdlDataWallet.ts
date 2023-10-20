import { ResultAsync } from "neverthrow";
import { FunctionKeys } from "utility-types";

import {
  EarnedReward,
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
  QueryStatus,
} from "@objects/businessObjects/index.js";
import {
  ECoreProxyType,
  EInvitationStatus,
  EWalletDataType,
} from "@objects/enum/index.js";
import { ProxyError } from "@objects/errors/index.js";
import { IConsentCapacity } from "@objects/interfaces/IConsentCapacity.js";
import { IOpenSeaMetadata } from "@objects/interfaces/IOpenSeaMetadata.js";
import {
  IAccountMethods,
  ICoreDiscordMethods,
  ICoreIntegrationMethods,
  ICoreTwitterMethods,
  IMetricsMethods,
  IPurchaseMethods,
  IScraperNavigationMethods,
  IStorageMethods,
} from "@objects/interfaces/ISnickerdoodleCore.js";
import { ISnickerdoodleCoreEvents } from "@objects/interfaces/ISnickerdoodleCoreEvents.js";
import {
  AccountAddress,
  Age,
  BigNumberString,
  BlockNumber,
  ChainId,
  CountryCode,
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

export type IProxyAccountMethods = {
  [key in FunctionKeys<IAccountMethods>]: (
    ...args: [...PopTuple<Parameters<IAccountMethods[key]>>]
  ) => ResultAsync<
    GetResultAsyncValueType<ReturnType<IAccountMethods[key]>>,
    ProxyError
  >;
};

// export type IProxyInvitationMethods = {
//   [key in FunctionKeys<IInvitationMethods>]: (
//     ...args: [...PopTuple<Parameters<IInvitationMethods[key]>>]
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

export type IProxyStorageMethods = {
  [key in FunctionKeys<IStorageMethods>]: (
    ...args: [...PopTuple<Parameters<IStorageMethods[key]>>]
  ) => ResultAsync<
    GetResultAsyncValueType<ReturnType<IStorageMethods[key]>>,
    ProxyError
  >;
};

export type IProxyScraperNavigationMethods = {
  [key in Exclude<
    FunctionKeys<IScraperNavigationMethods["amazon"]>,
    "getYears" | "getPageCount" | "getOrderHistoryPageByYear"
  >]: (
    ...args: [...Parameters<IScraperNavigationMethods["amazon"][key]>]
  ) => ResultAsync<
    ReturnType<IScraperNavigationMethods["amazon"][key]>,
    ProxyError
  >;
};

export type IProxyPurchaseMethods = {
  [key in FunctionKeys<IPurchaseMethods>]: (
    ...args: [...Parameters<IPurchaseMethods[key]>]
  ) => ResultAsync<
    GetResultAsyncValueType<ReturnType<IPurchaseMethods[key]>>,
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

// These types are how to put it all together when we're done
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
  getAcceptedInvitationsCID(): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
    ProxyError
  >;
  getAvailableInvitationsCID(): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
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
  setDefaultPermissionsToAll(): ResultAsync<void, ProxyError>;
  acceptInvitation(
    dataTypes: EWalletDataType[] | null,
    consentContractAddress: EVMContractAddress,
    tokenId?: BigNumberString,
    businessSignature?: Signature,
  ): ResultAsync<void, ProxyError>;
  rejectInvitation(
    consentContractAddress: EVMContractAddress,
    tokenId?: BigNumberString,
    businessSignature?: Signature,
    rejectUntil?: UnixTimestamp,
  );
  leaveCohort(
    consentContractAddress: EVMContractAddress,
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

  getQueryStatusByQueryCID(
    queryCID: IpfsCID,
  ): ResultAsync<QueryStatus | null, ProxyError>;

  getQueryStatuses(
    contractAddress: EVMContractAddress,
    blockNumber?: BlockNumber,
  ): ResultAsync<QueryStatus[], ProxyError>;

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
  ): ResultAsync<Map<EVMContractAddress, PossibleReward[]>, ProxyError>;

  switchToTab(tabId: number): ResultAsync<void, ProxyError>;

  proxyType: ECoreProxyType;
  account: IProxyAccountMethods;
  discord: IProxyDiscordMethods;
  integration: IProxyIntegrationMethods;
  twitter: IProxyTwitterMethods;
  metrics: IProxyMetricsMethods;
  storage: IProxyStorageMethods;
  events: ISnickerdoodleCoreEvents;
  purchase: IProxyPurchaseMethods;
  scrapernavigation: IProxyScraperNavigationMethods;
}

export const defaultLanguageCode = LanguageCode("en");
