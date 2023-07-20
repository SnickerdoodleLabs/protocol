import {
  IConfigOverrides,
  ISdlDataWallet,
  PersistenceError,
  ProxyError,
  URLString,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { Container } from "inversify";
import { ResultAsync, okAsync } from "neverthrow";

import { ISnickerdoodleWebIntegration } from "@web-integration/interfaces/app/index.js";
import {
  IIFrameProxyFactory,
  IIFrameProxyFactoryType,
} from "@web-integration/interfaces/proxy/index.js";
import { webIntegrationModule } from "@web-integration/WebIntegrationModule.js";

export class SnickerdoodleWebIntegration
  implements ISnickerdoodleWebIntegration
{
  protected iframeURL = URLString("http://localhost:9010");
  protected debug = false;
  protected iocContainer: Container;

  protected _core: ISdlDataWallet | null = null;

  protected initializeResult: ResultAsync<
    ISdlDataWallet,
    ProxyError | PersistenceError
  > | null = null;

  constructor(protected config: IConfigOverrides) {
    this.iframeURL = config.iframeURL || this.iframeURL;
    this.debug = config.debug || this.debug;

    this.iocContainer = new Container();

    // Elaborate syntax to demonstrate that we can use multiple modules
    this.iocContainer.load(...[webIntegrationModule]);
  }

  public get core(): ISdlDataWallet {
    if (this._core == null) {
      throw new UninitializedError("Must call initialize() first");
    }
    return this._core;
  }

  // wait for the core to be intialized
  public initialize(): ResultAsync<ISdlDataWallet, Error> {
    if (this.initializeResult != null) {
      return this.initializeResult;
    }

    console.log("Activating Snickerdoodle Core web integration");

    // Check if the proxy is already injected
    if (window.sdlDataWallet != null) {
      // If there's already a proxy injected, we don't need to create a new one
      console.log("Existing Snickerdoodle injected proxy on the page");
      this._core = window.sdlDataWallet;
      console.log("Snickerdoodle Core web integration activated");
      this.initializeResult = okAsync(window.sdlDataWallet);
      return this.initializeResult;
    }

    // No proxy injected, create a new one via the iframe
    // Create a proxy connection to the iframe
    console.log("Creating Snickerdoodle Protocol Iframe Proxy");
    const proxyFactory = this.iocContainer.get<IIFrameProxyFactory>(
      IIFrameProxyFactoryType,
    );

    this.initializeResult = proxyFactory
      .createProxy(this.iframeURL, this.config)
      .map((proxy) => {
        // Assign the iframe proxy to the internal reference and the window object
        this._core = proxy;
        window.sdlDataWallet = this.core;
        console.log("Snickerdoodle Core web integration activated");
        return proxy;
      });
    return this.initializeResult;
  }
}

declare let window: {
  sdlDataWallet: ISdlDataWallet | undefined;
};
