import { VersionUtils } from "@synamint-extension-sdk/extensionShared";
import { InternalCoreGateway } from "@synamint-extension-sdk/gateways";
import { EPortNames, PORT_NOTIFICATION } from "@synamint-extension-sdk/shared";
import { UpdatableEventEmitterWrapper } from "@synamint-extension-sdk/utils";
import PortStream from "extension-port-stream";
import { JsonRpcEngine } from "json-rpc-engine";
import { createStreamMiddleware } from "json-rpc-middleware-stream";
import { errAsync, okAsync } from "neverthrow";
import pump from "pump";
import Browser from "webextension-polyfill";

export class BackgroundConnector {
  protected coreGateway!: InternalCoreGateway;
  protected notificationEmitter!: UpdatableEventEmitterWrapper;
  constructor(public portName: EPortNames) {
    this.factoryConnector();
  }

  private factoryConnector() {
    const port = Browser.runtime.connect({
      name: this.portName,
    });
    const portStream = new PortStream(port);
    const streamMiddleware = createStreamMiddleware();
    const rpcEngine = new JsonRpcEngine();
    rpcEngine.push(streamMiddleware.middleware);
    pump(streamMiddleware.stream, portStream, streamMiddleware.stream);
    if (!this.coreGateway) {
      this.coreGateway = new InternalCoreGateway(rpcEngine);
    } else {
      this.coreGateway.updateRpcEngine(rpcEngine);
    }
    if (!this.notificationEmitter) {
      this.notificationEmitter = new UpdatableEventEmitterWrapper(
        streamMiddleware.events,
        PORT_NOTIFICATION,
      );
    } else {
      this.notificationEmitter.update(streamMiddleware.events);
    }

    if (VersionUtils.isManifest3) {
      port.onDisconnect.addListener(this.factoryConnector.bind(this));
    }
  }
  public getConnectors() {
    return {
      coreGateway: this.coreGateway,
      notificationEmitter: this.notificationEmitter,
    };
  }
}
