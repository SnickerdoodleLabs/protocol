import {
  Age,
  Invitation,
  BigNumberString,
  CountryCode,
  DomainName,
  EmailAddressString,
  EVMAccountAddress,
  FamilyName,
  Gender,
  GivenName,
  IEVMNFT,
  LanguageCode,
  Signature,
  UnixTimestamp,
  UUID,
  DataPermissions,
  EVMContractAddress,
  IOpenSeaMetadata,
  IpfsCID,
  EChain,
  ITokenBalance,
} from "@snickerdoodlelabs/objects";
import { JsonRpcEngine, JsonRpcError } from "json-rpc-engine";
import { ResultAsync } from "neverthrow";

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
  IMetatransactionSignatureRequestCallbackParams,
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
} from "@shared/interfaces/actions";
import { IExternalState } from "@shared/interfaces/states";
import { SnickerDoodleCoreError } from "@shared/objects/errors";

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
  ): ResultAsync<IInvitationDomainWithUUID | string, JsonRpcError> {
    return this._handler.call(
      EExternalActions.GET_COHORT_INVITATION_WITH_DOMAIN,
      { domain, path } as IGetInvitationWithDomainParams,
    );
  }
  public acceptInvitation(
    dataPermissions: DataPermissions | null,
    id: UUID,
  ): ResultAsync<void, JsonRpcError> {
    return this._handler.call(EExternalActions.ACCEPT_INVITATION, {
      dataPermissions,
      id,
    } as IAcceptInvitationParams);
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
    accountAddress: EVMAccountAddress,
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
    accountAddress: EVMAccountAddress,
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
  public getUnlockMessage(
    languageCode: LanguageCode,
  ): ResultAsync<string, JsonRpcError> {
    return this._handler.call(EExternalActions.GET_UNLOCK_MESSAGE, {
      languageCode,
    } as IGetUnlockMessageParams);
  }
  public getAccounts(): ResultAsync<EVMAccountAddress[], JsonRpcError> {
    return this._handler.call(EExternalActions.GET_ACCOUNTS);
  }
  public getAccountBalances(): ResultAsync<ITokenBalance[], JsonRpcError> {
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
  public metatransactionSignatureRequestCallback(
    id: UUID,
    metatransactionSignature: Signature,
    nonce: BigNumberString,
  ): ResultAsync<void, unknown> {
    return this._handler.call(
      EExternalActions.METATRANSACTION_SIGNATURE_REQUEST_CALLBACK,
      {
        id,
        metatransactionSignature,
        nonce,
      } as IMetatransactionSignatureRequestCallbackParams,
    );
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
    EVMAccountAddress | null,
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
}
