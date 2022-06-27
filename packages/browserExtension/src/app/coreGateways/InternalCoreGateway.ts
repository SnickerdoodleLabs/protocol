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

export class InternalCoreGateway {
  protected _handler;
  constructor(protected rpcEngine: JsonRpcEngine) {
    this._handler = createCoreHandler(this.rpcEngine);
  }

  public getState(): ResultAsync<unknown, unknown> {
    return ResultAsync.fromPromise(
      this._handler(EInternalActions.GET_STATE),
      (e) => e,
    );
  }

  public login(
    accountAddress: EthereumAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ) {
    return ResultAsync.fromPromise(
      this._handler(EInternalActions.LOGIN, {
        accountAddress,
        signature,
        languageCode,
      } as ILoginParams),
      (e) => e,
    );
  }

  public addAccount(
    accountAddress: EthereumAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ) {
    return ResultAsync.fromPromise(
      this._handler(EInternalActions.ADD_ACCOUNT, {
        accountAddress,
        signature,
        languageCode,
      } as IAddAccountParams),
      (e) => e,
    );
  }

  public getLoginMessage(languageCode: LanguageCode) {
    return ResultAsync.fromPromise(
      this._handler(EInternalActions.GET_LOGIN_MESSAGE, {
        languageCode,
      } as IGetLoginMessageParams),
      (e) => e,
    );
  }
}
