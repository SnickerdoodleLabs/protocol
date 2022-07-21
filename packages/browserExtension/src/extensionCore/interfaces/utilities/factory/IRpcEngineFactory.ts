import { EPortNames } from "@shared/enums/ports";
import { URLString } from "@snickerdoodlelabs/objects";
import { JsonRpcEngine } from "json-rpc-engine";
import { Ok } from "neverthrow";
import { Runtime } from "webextension-polyfill";

export interface IRpcEngineFactory {
  createRrpcEngine(
    remotePort: Runtime.Port,
    origin: EPortNames | URLString,
    stream: any,
  ): Ok<JsonRpcEngine, never>;
}
