import { JsonRpcEngine, JsonRpcError } from "json-rpc-engine";
import { ResultAsync } from "neverthrow";
import { EExternalActions } from "@shared/enums";
import { IExternalState } from "@shared/interfaces/states";
import CoreHandler from "@app/coreGateways/handler/CoreHandler";
import {
  Age,
  Invitation,
  CountryCode,
  DomainName,
  EmailAddressString,
  EVMAccountAddress,
  FamilyName,
  Gender,
  GivenName,
  IEVMBalance,
  IEVMNFT,
  LanguageCode,
  Signature,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import {
  IAddAccountParams,
  IGetInvitationWithDomainParams,
  IGetUnlockMessageParams,
  ISetAgeParams,
  ISetBirthdayParams,
  ISetEmailParams,
  ISetFamilyNameParams,
  ISetGenderParams,
  ISetGivenNameParams,
  ISetLocationParams,
  IUnlockParams,
} from "@shared/interfaces/actions";

export class ExternalCoreGateway {
  protected _handler: CoreHandler;
  constructor(protected rpcEngine: JsonRpcEngine) {
    this._handler = new CoreHandler(rpcEngine);
  }
  public getState(): ResultAsync<IExternalState, JsonRpcError> {
    return this._handler.call(EExternalActions.GET_STATE);
  }

  public getInvitationWithDomain(
    domain: DomainName,
  ): ResultAsync<Invitation, JsonRpcError> {
    return this._handler.call(
      EExternalActions.GET_COHORT_INVITATION_WITH_DOMAIN,
      { domain } as IGetInvitationWithDomainParams,
    );
  }

  public addAccount(
    accountAddress: EVMAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ): ResultAsync<void, JsonRpcError> {
    return this._handler.call(EExternalActions.ADD_ACCOUNT, {
      accountAddress,
      signature,
      languageCode,
    } as IAddAccountParams);
  }
  public unlock(
    accountAddress: EVMAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ): ResultAsync<void, JsonRpcError> {
    return this._handler.call(EExternalActions.UNLOCK, {
      accountAddress,
      signature,
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

  public getAge(): ResultAsync<Age, JsonRpcError> {
    return this._handler.call(EExternalActions.GET_AGE);
  }
  public getFamilyName(): ResultAsync<FamilyName, JsonRpcError> {
    return this._handler.call(EExternalActions.GET_FAMILY_NAME);
  }
  public getGivenName(): ResultAsync<GivenName, JsonRpcError> {
    return this._handler.call(EExternalActions.GET_GIVEN_NAME);
  }
  public getBirtday(): ResultAsync<UnixTimestamp, JsonRpcError> {
    return this._handler.call(EExternalActions.GET_BIRTHDAY);
  }
  public getEmail(): ResultAsync<EmailAddressString, JsonRpcError> {
    return this._handler.call(EExternalActions.GET_EMAIL);
  }
  public getGender(): ResultAsync<Gender, JsonRpcError> {
    return this._handler.call(EExternalActions.GET_GENDER);
  }
  public getLocation(): ResultAsync<CountryCode, JsonRpcError> {
    return this._handler.call(EExternalActions.GET_LOCATION);
  }
}
