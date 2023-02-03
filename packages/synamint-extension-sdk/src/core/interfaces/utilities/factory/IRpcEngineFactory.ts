import { URLString } from "@snickerdoodlelabs/objects";
import { JsonRpcEngine } from "json-rpc-engine";
import { Ok } from "neverthrow";
import { Runtime } from "webextension-polyfill";

import { EPortNames } from "@synamint-extension-sdk/shared/enums/ports";

export interface IRpcEngineFactory {
  createRrpcEngine(
    remotePort: Runtime.Port,
    origin: EPortNames | URLString,
    stream: any,
  ): Ok<JsonRpcEngine, never>;
}

export const IRpcEngineFactoryType = Symbol.for("IRpcEngineFactory");
