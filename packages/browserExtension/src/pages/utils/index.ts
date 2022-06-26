import { JsonRpcEngine } from "json-rpc-engine";
import { Runtime } from "webextension-polyfill";
import { createStreamMiddleware } from "json-rpc-middleware-stream";
import pump from "pump";
import PortStream from "extension-port-stream";
import { err, ok } from "neverthrow";

// TODO add docstring
export const createCoreHandler =
  (rpcEngine: JsonRpcEngine) => (method, params) =>
    new Promise((resolve, reject) => {
      let requestObject = { id: Date.now(), jsonrpc: "2.0" as "2.0", method };
      if (params) {
        requestObject = Object.assign(requestObject, { params: params });
      }
      rpcEngine.handle(requestObject, async (error, result) => {
        if (error) {
          // @ts-ignore - no type support provided
          return reject(error?.data?.originlError ?? new Error());
        }
        // @ts-ignore - no type support provided
        return resolve(result.result);
      });
    });

// TODO add docstring
export const createBackgroundConnectors = (port: Runtime.Port) => {
  const portStream = new PortStream(port);
  const streamMiddleware = createStreamMiddleware();
  const rpcEngine = new JsonRpcEngine();
  rpcEngine.push(streamMiddleware.middleware);
  pump(streamMiddleware.stream, portStream, streamMiddleware.stream, (e) => {
    err(e);
  });
  return ok({ rpcEngine, streamMiddleware });
};
