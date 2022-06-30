import { JsonRpcEngine } from "json-rpc-engine";
import { ResultAsync } from "neverthrow";
import {
  IAddAccountParams,
  IGetLoginMessageParams,
  ILoginParams,
} from "@shared/objects/EventParams";
import { EInternalActions } from "@shared/constants/actions";
import {
  EthereumAccountAddress,
  LanguageCode,
  Signature,
} from "@snickerdoodlelabs/objects";

import { createCoreHandler } from "app/utils";
import { IInternalState } from "@shared/objects/State";

export class InternalCoreGateway {
  protected _handler;
  constructor(protected rpcEngine: JsonRpcEngine) {
    this._handler = (method, params) =>
      ResultAsync.fromPromise(
        createCoreHandler(this.rpcEngine)(method, params),
        (e) => e,
      );
  }

  public getState(): ResultAsync<IInternalState, unknown> {
    return this._handler(EInternalActions.GET_STATE);
  }

  public login(
    accountAddress: EthereumAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ) {
    return this._handler(EInternalActions.LOGIN, {
      accountAddress,
      signature,
      languageCode,
    } as ILoginParams);
  }

  public addAccount(
    accountAddress: EthereumAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ) {
    return this._handler(EInternalActions.ADD_ACCOUNT, {
      accountAddress,
      signature,
      languageCode,
    } as IAddAccountParams);
  }

  public getLoginMessage(languageCode: LanguageCode) {
    return this._handler(EInternalActions.GET_LOGIN_MESSAGE, {
      languageCode,
    } as IGetLoginMessageParams);
  }
}
