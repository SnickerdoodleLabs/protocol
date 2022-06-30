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

import { IInternalState } from "@shared/objects/State";
import CoreHandler from "@app/coreGateways/handler/CoreHandler";

export class InternalCoreGateway {
  protected _handler: CoreHandler;
  constructor(protected rpcEngine: JsonRpcEngine) {
    this._handler = new CoreHandler(rpcEngine);
  }

  public getState(): ResultAsync<IInternalState, unknown> {
    return this._handler.call(EInternalActions.GET_STATE);
  }

  public login(
    accountAddress: EthereumAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ) {
    return this._handler.call(EInternalActions.LOGIN, {
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
    return this._handler.call(EInternalActions.ADD_ACCOUNT, {
      accountAddress,
      signature,
      languageCode,
    } as IAddAccountParams);
  }

  public getLoginMessage(languageCode: LanguageCode) {
    return this._handler.call(EInternalActions.GET_LOGIN_MESSAGE, {
      languageCode,
    } as IGetLoginMessageParams);
  }
}
