import { JsonRpcEngine } from "json-rpc-engine";

import { createCoreHandler } from "app/utils";
import { ResultAsync } from "neverthrow";
import { EInternalActions } from "@shared/constants/actions";
import { IExternalState } from "@shared/objects/State";

export class ExternalCoreGateway {
  protected _handler;
  constructor(protected rpcEngine: JsonRpcEngine) {
    this._handler = createCoreHandler(this.rpcEngine);
  }
  public getState(): ResultAsync<IExternalState, unknown> {
    return ResultAsync.fromPromise(
      this._handler(EInternalActions.GET_STATE),
      (e) => e,
    );
  }
}
