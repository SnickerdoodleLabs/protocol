import { URLString } from "@snickerdoodlelabs/objects";
import { JsonRpcEngine } from "json-rpc-engine";
import { ResultAsync } from "neverthrow";
import pump from "pump";
import { Runtime } from "webextension-polyfill";

import { EPortNames } from "@shared/enums/ports";

export interface IRpcEngineFactory {
  createRpcEngine(
    remotePort: Runtime.Port,
    origin: EPortNames | URLString,
    stream: pump.Stream,
  ): ResultAsync<JsonRpcEngine, never>;
}

export const IRpcEngineFactoryType = Symbol.for("IRpcEngineFactory");
