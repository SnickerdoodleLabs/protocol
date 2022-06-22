import { JsonRpcEngine } from "json-rpc-engine";
import { ResultAsync } from "neverthrow";
import {
  AddAccountParams,
  GetLoginMessageParams,
  LoginParams,
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
      this._handler(
        EInternalActions.LOGIN,
        new LoginParams(accountAddress, signature, languageCode),
      ),
    );
  }

  public addAccount(
    accountAddress: EthereumAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ) {
    return ResultAsync.fromSafePromise(
      this._handler(
        EInternalActions.ADD_ACCOUNT,
        new AddAccountParams(accountAddress, signature, languageCode),
      ),
    );
  }

  public getSignature(languageCode: LanguageCode) {
    return ResultAsync.fromSafePromise(
      this._handler(
        EInternalActions.GET_LOGIN_MESSAGE,
        new GetLoginMessageParams(languageCode),
      ),
    );
  }
}
