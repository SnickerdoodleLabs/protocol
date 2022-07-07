import { JsonRpcEngine } from "json-rpc-engine";
import { ResultAsync } from "neverthrow";
import { EExternalActions } from "@shared/constants/actions";
import { IExternalState } from "@shared/objects/State";
import CoreHandler from "@app/coreGateways/handler/CoreHandler";
import {
  EVMAccountAddress,
  LanguageCode,
  Signature,
} from "@snickerdoodlelabs/objects";
import { IAddAccountParams } from "@shared/objects/EventParams";

export class ExternalCoreGateway {
  protected _handler: CoreHandler;
  constructor(protected rpcEngine: JsonRpcEngine) {
    this._handler = new CoreHandler(rpcEngine);
  }
  public getState(): ResultAsync<IExternalState, unknown> {
    return this._handler.call(EExternalActions.GET_STATE);
  }

  public addAccount(
    accountAddress: EVMAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ) {
    return this._handler.call(EExternalActions.ADD_ACCOUNT, {
      accountAddress,
      signature,
      languageCode,
    } as IAddAccountParams);
  }
}
