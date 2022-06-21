import { JsonRpcEngine } from "json-rpc-engine";
import { Ok } from "neverthrow";
import { Runtime } from "webextension-polyfill";

export interface IRpcEngineFactory {
  createRrpcEngine(remotePort: Runtime.Port): Ok<JsonRpcEngine, never>;
}
