import { URLString } from "@snickerdoodlelabs/objects";
import { EPortNames, ERequestChannel } from "@synamint-extension-sdk/shared";
import PortDuplexStream from "extension-port-stream";
import { JsonRpcEngine } from "json-rpc-engine";
import { Ok } from "neverthrow";
import { Duplex } from "readable-stream";
import { Runtime } from "webextension-polyfill";

export interface IRpcEngineFactory {
  createRpcEngine(
    remotePort: Runtime.Port,
    origin: EPortNames | URLString,
    stream: Duplex | PortDuplexStream,
    requestChannel: ERequestChannel,
  ): Ok<JsonRpcEngine, never>;
}

export const IRpcEngineFactoryType = Symbol.for("IRpcEngineFactory");
