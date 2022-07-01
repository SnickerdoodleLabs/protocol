import { JsonRpcEngine } from "json-rpc-engine";
import { ResultAsync } from "neverthrow";
import { EInternalActions } from "@shared/constants/actions";
import { IExternalState } from "@shared/objects/State";
import CoreHandler from "@app/coreGateways/handler/CoreHandler";

export class ExternalCoreGateway {
  protected _handler: CoreHandler;
  constructor(protected rpcEngine: JsonRpcEngine) {
    this._handler = new CoreHandler(rpcEngine);
  }
  public getState(): ResultAsync<IExternalState, unknown> {
    return this._handler.call(EInternalActions.GET_STATE);
  }
}
