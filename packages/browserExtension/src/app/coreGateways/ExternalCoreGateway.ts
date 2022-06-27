import { JsonRpcEngine } from "json-rpc-engine";

import { createCoreHandler } from "app/utils";

export class ExternalCoreGateway {
  protected _handler;
  constructor(protected rpcEngine: JsonRpcEngine) {
    this._handler = createCoreHandler(this.rpcEngine);
  }
  // not implemented
}
