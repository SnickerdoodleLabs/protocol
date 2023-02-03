import {
  Age,
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
  IOpenSeaMetadata,
  IpfsCID,
  EChain,
  EWalletDataType,
  AccountAddress,
  LinkedAccount,
  DataWalletAddress,
  BigNumberString,
  EInvitationStatus,
  WalletNFT,
  TokenBalance,
  EarnedReward,
  ChainId,
  TokenAddress,
  TokenInfo,
  TokenMarketData,
  SiteVisit,
  URLString,
  MarketplaceListing,
} from "@snickerdoodlelabs/objects";
import CoreHandler from "@synamint-extension-sdk/gateways/handler/CoreHandler";
import { EExternalActions } from "@synamint-extension-sdk/shared/enums";
import {
  IAcceptInvitationParams,
  IAddAccountParams,
  IGetInvitationMetadataByCIDParams,
  IGetInvitationWithDomainParams,
  IGetUnlockMessageParams,
  IInvitationDomainWithUUID,
  ILeaveCohortParams,
  IRejectInvitationParams,
  ISetBirthdayParams,
  ISetEmailParams,
  ISetFamilyNameParams,
  ISetGenderParams,
  ISetGivenNameParams,
  ISetLocationParams,
  IUnlockParams,
  ICheckURLParams,
  IAcceptInvitationByUUIDParams,
  IGetAgreementPermissionsParams,
  ISetDefaultPermissionsWithDataTypesParams,
  ISetApplyDefaultPermissionsParams,
  IUnlinkAccountParams,
  IScamFilterSettingsParams,
  IGetConsentContractCIDParams,
  ICheckInvitationStatusParams,
  IGetTokenPriceParams,
  IGetTokenMarketDataParams,
  IGetTokenInfoParams,
  IGetMarketplaceListingsParams,
  ISetDefaultReceivingAddressParams,
  ISetReceivingAddressParams,
  IGetReceivingAddressParams,
} from "@synamint-extension-sdk/shared/interfaces/actions";
import { IScamFilterPreferences } from "@synamint-extension-sdk/shared/interfaces/scamFilterPreferences";
import { IExternalState } from "@synamint-extension-sdk/shared/interfaces/states";
import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared/objects/errors";
import { JsonRpcEngine, JsonRpcError } from "json-rpc-engine";
import { ResultAsync } from "neverthrow";

export class ExternalCoreGateway {
  protected _handler: CoreHandler;
  constructor(protected rpcEngine: JsonRpcEngine) {
    this._handler = new CoreHandler(rpcEngine);
  }

  public updateRpcEngine(rpcEngine: JsonRpcEngine) {
    this._handler.updateRpcEngine(rpcEngine);
  }

  public getState(): ResultAsync<IExternalState, JsonRpcError> {
    return this._handler.call(EExternalActions.GET_STATE);
  }

  public getInvitationsByDomain(
    domain: DomainName,
    path: string,
  ): ResultAsync<IInvitationDomainWithUUID | null, JsonRpcError> {
    return this._handler.call(
      EExternalActions.GET_COHORT_INVITATION_WITH_DOMAIN,
      { domain, path } as IGetInvitationWithDomainParams,
    );
  }
  public acceptInvitationByUUID(
    dataTypes: EWalletDataType[] | null,
    id: UUID,
  ): ResultAsync<void, JsonRpcError> {
    return this._handler.call(EExternalActions.ACCEPT_INVITATION_BY_UUID, {
      dataTypes,
      id,
    } as IAcceptInvitationByUUIDParams);
  }

  public getAvailableInvitationsCID(): ResultAsync<
    Record<EVMContractAddress, IpfsCID>,
    JsonRpcError
  > {
    return this._handler.call(EExternalActions.GET_AVAILABLE_INVITATIONS_CID);
  }

  public acceptInvitation(
    dataTypes: EWalletDataType[] | null,
    consentContractAddress: EVMContractAddress,
    tokenId?: BigNumberString,
    businessSignature?: Signature,
  ): ResultAsync<void, JsonRpcError> {
    return this._handler.call(EExternalActions.ACCEPT_INVITATION, {
      dataTypes,
      consentContractAddress,
      tokenId,
      businessSignature,
    } as IAcceptInvitationParams);
  }

  public getAgreementPermissions(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<EWalletDataType[], JsonRpcError> {
    return this._handler.call(EExternalActions.GET_AGREEMENT_PERMISSIONS, {
      consentContractAddress,
    } as IGetAgreementPermissionsParams);
  }

  public getDefaultPermissions(): ResultAsync<EWalletDataType[], JsonRpcError> {
    return this._handler.call(EExternalActions.GET_DEFAULT_PERMISSIONS);
  }

  public setDefaultPermissionsWithDataTypes(
    dataTypes: EWalletDataType[],
  ): ResultAsync<void, JsonRpcError> {
    return this._handler.call(EExternalActions.SET_DEFAULT_PERMISSIONS, {
      dataTypes,
    } as ISetDefaultPermissionsWithDataTypesParams);
  }

  public setDefaultPermissionsToAll(): ResultAsync<void, JsonRpcError> {
    return this._handler.call(EExternalActions.SET_DEFAULT_PERMISSIONS_TO_ALL);
  }
  public getScamFilterSettings(): ResultAsync<
    IScamFilterPreferences,
    JsonRpcError
  > {
    return this._handler.call(EExternalActions.GET_SCAM_FILTER_SETTINGS);
  }

  public setScamFilterSettings(
    isScamFilterActive: boolean,
    showMessageEveryTime: boolean,
  ): ResultAsync<void, JsonRpcError> {
    return this._handler.call(EExternalActions.SET_SCAM_FILTER_SETTINGS, {
      isScamFilterActive,
      showMessageEveryTime,
    } as IScamFilterSettingsParams);
  }

  public rejectInvitation(id: UUID): ResultAsync<void, JsonRpcError> {
    return this._handler.call(EExternalActions.REJECT_INVITATION, {
      id,
    } as IRejectInvitationParams);
  }

  public getAcceptedInvitationsCID(): ResultAsync<
    Record<EVMContractAddress, IpfsCID>,
    JsonRpcError
  > {
    return this._handler.call(EExternalActions.GET_ACCEPTED_INVITATIONS_CID);
  }

  public getInvitationMetadataByCID(
    ipfsCID: IpfsCID,
  ): ResultAsync<IOpenSeaMetadata, JsonRpcError> {
    return this._handler.call(EExternalActions.GET_INVITATION_METADATA_BY_CID, {
      ipfsCID,
    } as IGetInvitationMetadataByCIDParams);
  }

  public leaveCohort(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<void, JsonRpcError> {
    return this._handler.call(EExternalActions.LEAVE_COHORT, {
      consentContractAddress,
    } as ILeaveCohortParams);
  }

  public addAccount(
    accountAddress: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode: LanguageCode,
  ): ResultAsync<void, JsonRpcError> {
    return this._handler.call(EExternalActions.ADD_ACCOUNT, {
      accountAddress,
      signature,
      chain,
      languageCode,
    } as IAddAccountParams);
  }
  public unlock(
    accountAddress: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode: LanguageCode,
  ): ResultAsync<void, JsonRpcError> {
    return this._handler.call(EExternalActions.UNLOCK, {
      accountAddress,
      signature,
      chain,
      languageCode,
    } as IUnlockParams);
  }
  public unlinkAccount(
    accountAddress: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode: LanguageCode,
  ): ResultAsync<void, JsonRpcError> {
    return this._handler.call(EExternalActions.UNLINK_ACCOUNT, {
      accountAddress,
      chain,
      languageCode,
      signature,
    } as IUnlinkAccountParams);
  }
  public getUnlockMessage(
    languageCode: LanguageCode,
  ): ResultAsync<string, JsonRpcError> {
    return this._handler.call(EExternalActions.GET_UNLOCK_MESSAGE, {
      languageCode,
    } as IGetUnlockMessageParams);
  }
  public getApplyDefaultPermissionsOption(): ResultAsync<
    boolean,
    JsonRpcError
  > {
    return this._handler.call(
      EExternalActions.GET_APPLY_DEFAULT_PERMISSIONS_OPTION,
    );
  }
  public setApplyDefaultPermissionsOption(
    option: boolean,
  ): ResultAsync<boolean, JsonRpcError> {
    return this._handler.call(
      EExternalActions.SET_APPLY_DEFAULT_PERMISSIONS_OPTION,
      { option } as ISetApplyDefaultPermissionsParams,
    );
  }
  public getAccounts(): ResultAsync<LinkedAccount[], JsonRpcError> {
    return this._handler.call(EExternalActions.GET_ACCOUNTS);
  }
  public getAccountBalances(): ResultAsync<TokenBalance[], JsonRpcError> {
    return this._handler.call(EExternalActions.GET_ACCOUNT_BALANCES);
  }
  public getTokenPrice(
    chainId: ChainId,
    address: TokenAddress | null,
    timestamp?: UnixTimestamp,
  ): ResultAsync<number, JsonRpcError> {
    return this._handler.call(EExternalActions.GET_TOKEN_PRICE, {
      chainId,
      address,
      timestamp,
    } as IGetTokenPriceParams);
  }
  public getTokenMarketData(
    ids: string[],
  ): ResultAsync<TokenMarketData[], SnickerDoodleCoreError> {
    return this._handler.call(EExternalActions.GET_TOKEN_MARKET_DATA, {
      ids,
    } as IGetTokenMarketDataParams);
  }
  public getTokenInfo(
    chainId: ChainId,
    contractAddress: TokenAddress | null,
  ): ResultAsync<TokenInfo | null, SnickerDoodleCoreError> {
    return this._handler.call(EExternalActions.GET_TOKEN_INFO, {
      chainId,
      contractAddress,
    } as IGetTokenInfoParams);
  }
  public getAccountNFTs(): ResultAsync<WalletNFT[], JsonRpcError> {
    return this._handler.call(EExternalActions.GET_ACCOUNT_NFTS);
  }

  public setFamilyName(
    familyName: FamilyName,
  ): ResultAsync<void, JsonRpcError> {
    return this._handler.call(EExternalActions.SET_FAMILY_NAME, {
      familyName,
    } as ISetFamilyNameParams);
  }
  public setGivenName(givenName: GivenName): ResultAsync<void, JsonRpcError> {
    return this._handler.call(EExternalActions.SET_GIVEN_NAME, {
      givenName,
    } as ISetGivenNameParams);
  }
  public setBirtday(birthday: UnixTimestamp): ResultAsync<void, JsonRpcError> {
    return this._handler.call(EExternalActions.SET_BIRTHDAY, {
      birthday,
    } as ISetBirthdayParams);
  }
  public setEmail(email: EmailAddressString): ResultAsync<void, JsonRpcError> {
    return this._handler.call(EExternalActions.SET_EMAIL, {
      email,
    } as ISetEmailParams);
  }
  public setGender(gender: Gender): ResultAsync<void, JsonRpcError> {
    return this._handler.call(EExternalActions.SET_GENDER, {
      gender,
    } as ISetGenderParams);
  }
  public setLocation(location: CountryCode): ResultAsync<void, JsonRpcError> {
    return this._handler.call(EExternalActions.SET_LOCATION, {
      location,
    } as ISetLocationParams);
  }

  public getAge(): ResultAsync<Age | null, JsonRpcError> {
    return this._handler.call(EExternalActions.GET_AGE);
  }
  public getFamilyName(): ResultAsync<FamilyName | null, JsonRpcError> {
    return this._handler.call(EExternalActions.GET_FAMILY_NAME);
  }
  public getGivenName(): ResultAsync<GivenName | null, JsonRpcError> {
    return this._handler.call(EExternalActions.GET_GIVEN_NAME);
  }
  public getBirtday(): ResultAsync<UnixTimestamp | null, JsonRpcError> {
    return this._handler.call(EExternalActions.GET_BIRTHDAY);
  }
  public getEmail(): ResultAsync<EmailAddressString | null, JsonRpcError> {
    return this._handler.call(EExternalActions.GET_EMAIL);
  }
  public getGender(): ResultAsync<Gender | null, JsonRpcError> {
    return this._handler.call(EExternalActions.GET_GENDER);
  }
  public getLocation(): ResultAsync<CountryCode | null, JsonRpcError> {
    return this._handler.call(EExternalActions.GET_LOCATION);
  }
  public isDataWalletAddressInitialized(): ResultAsync<boolean, JsonRpcError> {
    return this._handler.call(
      EExternalActions.IS_DATA_WALLET_ADDRESS_INITIALIZED,
    );
  }
  public closeTab(): ResultAsync<void, JsonRpcError> {
    return this._handler.call(EExternalActions.CLOSE_TAB);
  }
  public getDataWalletAddress(): ResultAsync<
    DataWalletAddress | null,
    JsonRpcError
  > {
    return this._handler.call(EExternalActions.GET_DATA_WALLET_ADDRESS);
  }
  public checkURL(domain: DomainName): ResultAsync<string, JsonRpcError> {
    return this._handler.call(EExternalActions.CHECK_URL, {
      domain,
    } as ICheckURLParams);
  }

  public checkInvitationStatus(
    consentAddress: EVMContractAddress,
    signature?: Signature,
    tokenId?: BigNumberString,
  ): ResultAsync<EInvitationStatus, JsonRpcError> {
    return this._handler.call(EExternalActions.CHECK_INVITATION_STATUS, {
      consentAddress,
      signature,
      tokenId,
    } as ICheckInvitationStatusParams);
  }

  public getContractCID(
    consentAddress: EVMContractAddress,
  ): ResultAsync<IpfsCID, JsonRpcError> {
    return this._handler.call(EExternalActions.GET_CONTRACT_CID, {
      consentAddress,
    } as IGetConsentContractCIDParams);
  }

  public getEarnedRewards(): ResultAsync<EarnedReward[], JsonRpcError> {
    return this._handler.call(EExternalActions.GET_EARNED_REWARDS);
  }

  public getSiteVisits(): ResultAsync<SiteVisit[], JsonRpcError> {
    return this._handler.call(EExternalActions.GET_SITE_VISITS);
  }

  public getSiteVisitsMap(): ResultAsync<
    Record<URLString, number>,
    JsonRpcError
  > {
    return this._handler.call(EExternalActions.GET_SITE_VISITS_MAP);
  }

  public getMarketplaceListings(
    count?: number | undefined,
    headAt?: number | undefined,
  ): ResultAsync<MarketplaceListing, SnickerDoodleCoreError> {
    return this._handler.call(EExternalActions.GET_MARKETPLACE_LISTINGS, {
      count,
      headAt,
    } as IGetMarketplaceListingsParams);
  }

  public getListingsTotal(): ResultAsync<number, SnickerDoodleCoreError> {
    return this._handler.call(EExternalActions.GET_LISTING_TOTAL);
  }

  public setDefaultReceivingAddress(
    receivingAddress: AccountAddress | null,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this._handler.call(EExternalActions.SET_DEFAULT_RECEIVING_ACCOUNT, {
      receivingAddress,
    } as ISetDefaultReceivingAddressParams);
  }

  public setReceivingAddress(
    contractAddress: EVMContractAddress,
    receivingAddress: AccountAddress | null,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this._handler.call(EExternalActions.SET_RECEIVING_ACCOUNT, {
      contractAddress,
      receivingAddress,
    } as ISetReceivingAddressParams);
  }

  public getReceivingAddress(
    contractAddress?: EVMContractAddress,
  ): ResultAsync<AccountAddress, SnickerDoodleCoreError> {
    return this._handler.call(EExternalActions.GET_RECEIVING_ACCOUNT, {
      contractAddress,
    } as IGetReceivingAddressParams);
  }
}
