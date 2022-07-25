import { JsonRpcEngine } from "json-rpc-engine";
import { ResultAsync } from "neverthrow";

import { EInternalActions } from "@shared/enums";

import { IInternalState } from "@shared/interfaces/states";
import CoreHandler from "@app/coreGateways/handler/CoreHandler";

export class InternalCoreGateway {
  protected _handler: CoreHandler;
  constructor(protected rpcEngine: JsonRpcEngine) {
    this._handler = new CoreHandler(rpcEngine);
  }

  public getState(): ResultAsync<IInternalState, unknown> {
    return this._handler.call(EInternalActions.GET_STATE);
  }
}
