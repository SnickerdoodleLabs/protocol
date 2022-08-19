import PortStream from "extension-port-stream";
import { JsonRpcEngine } from "json-rpc-engine";
import { createStreamMiddleware } from "json-rpc-middleware-stream";
import { err, ok } from "neverthrow";
import pump from "pump";
import { Runtime } from "webextension-polyfill";

// TODO add docstring
export const createBackgroundConnectors = (port: Runtime.Port) => {
  const portStream = new PortStream(port);
  const streamMiddleware = createStreamMiddleware();
  const rpcEngine = new JsonRpcEngine();
  rpcEngine.push(streamMiddleware.middleware);
  pump(streamMiddleware.stream, portStream, streamMiddleware.stream, (e) => {
    err(e);
  });
  return ok({ rpcEngine, streamMiddleware, portStream });
};
