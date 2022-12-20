import { EventEmitter } from "events";

import { ResultAsync } from "neverthrow";

import {
  EarnedReward,
  LinkedAccount,
  TokenAddress,
  TokenBalance,
  TokenInfo,
  TokenMarketData,
  WalletNFT,
  SiteVisit,
  MarketplaceListing,
} from "@objects/businessObjects";
import { EChain, EInvitationStatus, EWalletDataType } from "@objects/enum";
import { IOpenSeaMetadata } from "@objects/interfaces/IOpenSeaMetadata";
import { IScamFilterPreferences } from "@objects/interfaces/IScamFilterPreferences";
import {
  AccountAddress,
  Age,
  BigNumberString,
  ChainId,
  CountryCode,
  DataWalletAddress,
  EmailAddressString,
  EVMContractAddress,
  FamilyName,
  Gender,
  GivenName,
  IpfsCID,
  LanguageCode,
  Signature,
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
  setAge(age: Age): ResultAsync<void, JsonRpcError>;
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

  getMarketplaceListings(
    count?: number,
    headAt?: number,
  ): ResultAsync<MarketplaceListing, JsonRpcError>;

  getListingsTotal(): ResultAsync<number, JsonRpcError>;
}
