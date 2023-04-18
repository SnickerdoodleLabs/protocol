import {
  Age,
  BigNumberString,
  CountryCode,
  DomainName,
  EmailAddressString,
  FamilyName,
  Gender,
  GivenName,
  LanguageCode,
  Signature,
  UnixTimestamp,
  UUID,
  EVMContractAddress,
  URLString,
  IpfsCID,
  EChain,
  EWalletDataType,
  AccountAddress,
  ChainId,
  TokenAddress,
  PagingRequest,
  MarketplaceTag,
  BearerAuthToken,
  SnowflakeID,
  OAuthAuthorizationCode,
  LinkedAccount,
} from "@snickerdoodlelabs/objects";

export interface IUnlockParams {
  accountAddress: AccountAddress;
  signature: Signature;
  chain: EChain;
  languageCode: LanguageCode;
}

export interface IAddAccountParams {
  accountAddress: AccountAddress;
  signature: Signature;
  chain: EChain;
  languageCode: LanguageCode;
}

export interface IUnlinkAccountParams {
  accountAddress: AccountAddress;
  signature: Signature;
  chain: EChain;
  languageCode: LanguageCode;
}

export interface IGetUnlockMessageParams {
  languageCode: LanguageCode;
}

export interface ISetGivenNameParams {
  givenName: GivenName;
}

export interface ISetFamilyNameParams {
  familyName: FamilyName;
}

export interface ISetBirthdayParams {
  birthday: UnixTimestamp;
}

export interface ISetGenderParams {
  gender: Gender;
}

export interface ISetEmailParams {
  email: EmailAddressString;
}

export interface ISetLocationParams {
  location: CountryCode;
}

export interface ISetApplyDefaultPermissionsParams {
  option: boolean;
}
export interface IGetInvitationWithDomainParams {
  domain: DomainName;
  path: string;
}
export interface IAcceptInvitationByUUIDParams {
  dataTypes: EWalletDataType[];
  id: UUID;
}
export interface IAcceptInvitationParams {
  dataTypes: EWalletDataType[];
  consentContractAddress: EVMContractAddress;
  tokenId?: BigNumberString;
  businessSignature?: Signature;
}

export interface IGetAgreementPermissionsParams {
  consentContractAddress: EVMContractAddress;
}

export interface ISetDefaultPermissionsWithDataTypesParams {
  dataTypes: EWalletDataType[];
}
export interface IRejectInvitationParams {
  id: UUID;
}

export interface ILeaveCohortParams {
  consentContractAddress: EVMContractAddress;
}

export interface IGetInvitationMetadataByCIDParams {
  ipfsCID: IpfsCID;
}

export interface IInvitationDomainWithUUID {
  consentAddress: EVMContractAddress;
  domain: DomainName;
  title: string;
  description: string;
  image: URLString;
  rewardName: string;
  nftClaimedImage: URLString;
  id: UUID;
}
export interface ICheckURLParams {
  domain: DomainName;
}
export interface IGetAccountNFTsParams {
  chains?: ChainId[];
  accounts?: LinkedAccount[];
}

export interface IGetAccountBalancesParams {
  chains?: ChainId[];
  accounts?: LinkedAccount[];
}

export interface IScamFilterSettingsParams {
  isScamFilterActive: boolean;
  showMessageEveryTime: boolean;
}
export interface IGetConsentContractCIDParams {
  consentAddress: EVMContractAddress;
}

export interface ICheckInvitationStatusParams {
  consentAddress: EVMContractAddress;
  signature?: Signature | undefined;
  tokenId?: BigNumberString | undefined;
}

export interface IGetTokenPriceParams {
  chainId: ChainId;
  address: TokenAddress | null;
  timestamp?: UnixTimestamp;
}

export interface IGetTokenMarketDataParams {
  ids: string[];
}

export interface IGetTokenInfoParams {
  chainId: ChainId;
  contractAddress: TokenAddress | null;
}

export interface IGetMarketplaceListingsByTagParams {
  pagingReq: PagingRequest;
  tag: MarketplaceTag;
  filterActive?: boolean;
}

export interface IGetListingsTotalByTagParams {
  tag: MarketplaceTag;
}

export interface ISetDefaultReceivingAddressParams {
  receivingAddress: AccountAddress | null;
}

export interface ISetReceivingAddressParams {
  contractAddress: EVMContractAddress;
  receivingAddress: AccountAddress | null;
}

export interface IGetReceivingAddressParams {
  contractAddress?: EVMContractAddress;
}

export interface IGetConsentCapacityParams {
  contractAddress: EVMContractAddress;
}

export interface IGetPossibleRewardsParams {
  contractAddresses: EVMContractAddress[];
  timeoutMs?: number;
}
export interface IInitializeDiscordUser {
  code: OAuthAuthorizationCode;
}
export interface IUnlinkDiscordAccount {
  discordProfileId: SnowflakeID;
}
