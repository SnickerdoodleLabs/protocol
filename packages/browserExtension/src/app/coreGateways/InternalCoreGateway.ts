import { JsonRpcEngine } from "json-rpc-engine";
import { ResultAsync } from "neverthrow";
import {
  IAddAccountParams,
  IUnlockParams,
  IGetUnlockMessageParams,
} from "@shared/objects/EventParams";
import { EInternalActions } from "@shared/constants/actions";
import {
  EVMAccountAddress,
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

  public unlock(
    accountAddress: EVMAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ) {
    return this._handler.call(EInternalActions.UNLOCK, {
      accountAddress,
      signature,
      languageCode,
    } as IUnlockParams);
  }

  public addAccount(
    accountAddress: EVMAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ) {
    return this._handler.call(EInternalActions.ADD_ACCOUNT, {
      accountAddress,
      signature,
      languageCode,
    } as IAddAccountParams);
  }

  public getUnlockMessage(
    languageCode: LanguageCode,
  ): ResultAsync<string, unknown> {
    return this._handler.call(EInternalActions.GET_UNLOCK_MESSAGE, {
      languageCode,
    } as IGetUnlockMessageParams);
  }
}
