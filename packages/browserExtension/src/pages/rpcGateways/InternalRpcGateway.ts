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

import { createRpcEventDispatcherPromise } from "@utils";

export class InternalRpcGateway {
  protected _handler;
  constructor(protected rpcEngine: JsonRpcEngine) {
    this._handler = createRpcEventDispatcherPromise(this.rpcEngine);
  }

  public login(
    accountAddress: EthereumAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ) {
    return ResultAsync.fromSafePromise(
      this._handler(EInternalActions.LOGIN, {
        accountAddress,
        signature,
        languageCode,
      } as ILoginParams),
    );
  }

  public addAccount(
    accountAddress: EthereumAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ) {
    return ResultAsync.fromSafePromise(
      this._handler(EInternalActions.ADD_ACCOUNT, {
        accountAddress,
        signature,
        languageCode,
      } as IAddAccountParams),
    );
  }

  public getLoginMessage(languageCode: LanguageCode) {
    return ResultAsync.fromSafePromise(
      this._handler(EInternalActions.GET_LOGIN_MESSAGE, {
        languageCode,
      } as IGetLoginMessageParams),
    );
  }
}
