import { IRpcCallHandler } from "@interfaces/api";
import { IAccountService, IPIIService } from "@interfaces/business";
import { IContextProvider } from "@interfaces/utilities";
import { EExternalActions, EInternalActions } from "@shared/enums";
import { DEFAULT_RPC_SUCCESS_RESULT } from "@shared/constants/rpcCall";
import {
  SnickerDoodleCoreError,
  ExtensionCookieError,
} from "@shared/objects/errors";
import {
  IUnlockParams,
  IGetUnlockMessageParams,
  IAddAccountParams,
  ISetAgeParams,
  ISetGivenNameParams,
  ISetFamilyNameParams,
  ISetBirthdayParams,
  ISetGenderParams,
  ISetLocationParams,
  ISetEmailParams,
} from "@shared/interfaces/actions";
import {
  Age,
  CountryCode,
  EmailAddressString,
  EVMAccountAddress,
  FamilyName,
  Gender,
  GivenName,
  LanguageCode,
  Signature,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import {
  AsyncJsonRpcEngineNextCallback,
  JsonRpcRequest,
  PendingJsonRpcResponse,
} from "json-rpc-engine";

import { okAsync, ResultAsync } from "neverthrow";
import { Runtime } from "webextension-polyfill";

export class RpcCallHandler implements IRpcCallHandler {
  constructor(
    protected contextProvider: IContextProvider,
    protected accountService: IAccountService,
    protected piiService: IPIIService,
  ) {}

  public async handleRpcCall(
    req: JsonRpcRequest<unknown>,
    res: PendingJsonRpcResponse<unknown>,
    next: AsyncJsonRpcEngineNextCallback,
    sender: Runtime.MessageSender | undefined
  ) {
    const { method, params } = req;
    
    switch (method) {
      case EExternalActions.UNLOCK: {
        const { accountAddress, signature, languageCode } =
          params as IUnlockParams;
        return this._sendAsyncResponse(
          this.unlock(accountAddress, signature, languageCode),
          res,
        );
      }
      case EExternalActions.ADD_ACCOUNT: {
        const { accountAddress, signature, languageCode } =
          params as IAddAccountParams;
        return this._sendAsyncResponse(
          this.addAccount(accountAddress, signature, languageCode),
          res,
        );
      }
      case EExternalActions.GET_UNLOCK_MESSAGE: {
        const { languageCode } = params as IGetUnlockMessageParams;
        return this._sendAsyncResponse(
          this.getUnlockMessage(languageCode),
          res,
        );
      }
      case EExternalActions.SET_AGE: {
        const { age } = params as ISetAgeParams;
        return this._sendAsyncResponse(this.setAge(age), res);
      }
      case EExternalActions.SET_GIVEN_NAME: {
        const { givenName } = params as ISetGivenNameParams;
        return this._sendAsyncResponse(this.setGivenName(givenName), res);
      }
      case EExternalActions.SET_EMAIL: {
        const { email } = params as ISetEmailParams;
        return this._sendAsyncResponse(this.setEmail(email), res);
      }
      case EExternalActions.SET_FAMILY_NAME: {
        const { familyName } = params as ISetFamilyNameParams;
        return this._sendAsyncResponse(this.setFamilyName(familyName), res);
      }
      case EExternalActions.SET_BIRTHDAY: {
        const { birthday } = params as ISetBirthdayParams;
        return this._sendAsyncResponse(this.setBirthday(birthday), res);
      }
      case EExternalActions.SET_GENDER: {
        const { gender } = params as ISetGenderParams;
        return this._sendAsyncResponse(this.setGender(gender), res);
      }
      case EExternalActions.SET_LOCATION: {
        const { location } = params as ISetLocationParams;
        return this._sendAsyncResponse(this.setLocation(location), res);
      }
      case EExternalActions.GET_AGE: {
        return this._sendAsyncResponse(this.getAge(), res);
      }
      case EExternalActions.GET_GIVEN_NAME: {
        return this._sendAsyncResponse(this.getGivenName(), res);
      }
      case EExternalActions.GET_EMAIL: {
        return this._sendAsyncResponse(this.getEmail(), res);
      }
      case EExternalActions.GET_FAMILY_NAME: {
        return this._sendAsyncResponse(this.getFamilyName(), res);
      }
      case EExternalActions.GET_BIRTHDAY: {
        return this._sendAsyncResponse(this.getBirthday(), res);
      }
      case EExternalActions.GET_GENDER: {
        return this._sendAsyncResponse(this.getGender(), res);
      }
      case EExternalActions.GET_LOCATION: {
        return this._sendAsyncResponse(this.getLocation(), res);
      }
      case EExternalActions.GET_STATE:
        return (res.result = this.contextProvider.getExterenalState());

      case EInternalActions.GET_STATE:
        return (res.result = this.contextProvider.getInternalState());
      default:
        return next();
    }
  }

  private _sendAsyncResponse = async <T, K extends Error>(
    fn: ResultAsync<T, K>,
    res: PendingJsonRpcResponse<unknown>,
  ) => {
    await fn
      .mapErr((err) => {
        res.error = err;
      })
      .map((result) => {
        if (typeof result === typeof undefined) {
          res.result = DEFAULT_RPC_SUCCESS_RESULT;
        } else {
          res.result = result;
        }
        return okAsync(undefined);
      });
  };

  private unlock(
    account: EVMAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ): ResultAsync<void, SnickerDoodleCoreError | ExtensionCookieError> {
    return this.accountService.unlock(account, signature, languageCode);
  }
  private addAccount(
    account: EVMAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ): ResultAsync<void, SnickerDoodleCoreError | ExtensionCookieError> {
    return this.accountService.addAccount(account, signature, languageCode);
  }
  private getUnlockMessage(
    languageCode: LanguageCode,
  ): ResultAsync<string, SnickerDoodleCoreError> {
    return this.accountService.getUnlockMessage(languageCode);
  }
  private setAge(age: Age): ResultAsync<void, SnickerDoodleCoreError> {
    return this.piiService.setAge(age);
  }
  private getAge(): ResultAsync<Age, SnickerDoodleCoreError> {
    return this.piiService.getAge();
  }
  private setGivenName(
    name: GivenName,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.piiService.setGivenName(name);
  }
  private getGivenName(): ResultAsync<GivenName, SnickerDoodleCoreError> {
    return this.piiService.getGivenName();
  }
  private setFamilyName(
    name: FamilyName,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.piiService.setFamilyName(name);
  }
  private getFamilyName(): ResultAsync<FamilyName, SnickerDoodleCoreError> {
    return this.piiService.getFamilyName();
  }
  private setBirthday(
    birthday: UnixTimestamp,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.piiService.setBirthday(birthday);
  }
  private getBirthday(): ResultAsync<UnixTimestamp, SnickerDoodleCoreError> {
    return this.piiService.getBirthday();
  }
  private setGender(gender: Gender): ResultAsync<void, SnickerDoodleCoreError> {
    return this.piiService.setGender(gender);
  }
  private getGender(): ResultAsync<Gender, SnickerDoodleCoreError> {
    return this.piiService.getGender();
  }
  private setEmail(
    email: EmailAddressString,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.piiService.setEmail(email);
  }
  private getEmail(): ResultAsync<EmailAddressString, SnickerDoodleCoreError> {
    return this.piiService.getEmail();
  }
  private setLocation(
    location: CountryCode,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.piiService.setLocation(location);
  }
  private getLocation(): ResultAsync<CountryCode, SnickerDoodleCoreError> {
    return this.piiService.getLocation();
  }
}
