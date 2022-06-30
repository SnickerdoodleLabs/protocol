import { JsonRpcEngine } from "json-rpc-engine";

import { createCoreHandler } from "app/utils";
import { ResultAsync } from "neverthrow";
import { EInternalActions } from "@shared/constants/actions";
import { IExternalState } from "@shared/objects/State";

export class ExternalCoreGateway {
  protected _handler;
  constructor(protected rpcEngine: JsonRpcEngine) {
    this._handler = (method, params) =>
      ResultAsync.fromPromise(
        createCoreHandler(this.rpcEngine)(method, params),
        (e) => e,
      );
  }
  public getState(): ResultAsync<IExternalState, unknown> {
    return this._handler(EInternalActions.GET_STATE);
  }
}
