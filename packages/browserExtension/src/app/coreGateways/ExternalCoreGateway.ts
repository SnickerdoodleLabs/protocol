import { IScamFilterPreferences } from "@app/Content/components/ScamFilterComponent";
import CoreHandler from "@app/coreGateways/handler/CoreHandler";
import { EExternalActions } from "@shared/enums";
import {
  IAcceptInvitationParams,
  IAddAccountParams,
  IGetInvitationMetadataByCIDParams,
  IGetInvitationWithDomainParams,
  IGetUnlockMessageParams,
  IInvitationDomainWithUUID,
  ILeaveCohortParams,
  IRejectInvitationParams,
  ISetAgeParams,
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
  IGetConsentContractCIDParams,
  ICheckInvitationStatusParams,
  IScamFilterSettingsParams,
} from "@shared/interfaces/actions";
import { IExternalState } from "@shared/interfaces/states";
import { SnickerDoodleCoreError } from "@shared/objects/errors";
import {
  Age,
  CountryCode,
  DomainName,
  EmailAddressString,
  FamilyName,
  Gender,
  GivenName,
  IEVMBalance,
  IEVMNFT,
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
} from "@snickerdoodlelabs/objects";
import { JsonRpcEngine, JsonRpcError } from "json-rpc-engine";
import { ResultAsync } from "neverthrow";

export class ExternalCoreGateway {
  protected _handler: CoreHandler;
  constructor(protected rpcEngine: JsonRpcEngine) {
    this._handler = new CoreHandler(rpcEngine);
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
  public getScamFilterSettings(): ResultAsync<IScamFilterPreferences, JsonRpcError> {
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
  public getAccountBalances(): ResultAsync<IEVMBalance[], JsonRpcError> {
    return this._handler.call(EExternalActions.GET_ACCOUNT_BALANCES);
  }
  public getAccountNFTs(): ResultAsync<IEVMNFT[], JsonRpcError> {
    return this._handler.call(EExternalActions.GET_ACCOUNT_NFTS);
  }

  public setAge(age: Age): ResultAsync<void, JsonRpcError> {
    return this._handler.call(EExternalActions.SET_AGE, {
      age,
    } as ISetAgeParams);
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
  public checkURL(
    domain: DomainName,
  ): ResultAsync<string, SnickerDoodleCoreError> {
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
}
