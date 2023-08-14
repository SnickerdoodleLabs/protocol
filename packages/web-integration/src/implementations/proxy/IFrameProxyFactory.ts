import {
  IConfigOverrides,
  ProxyError,
  URLString,
} from "@snickerdoodlelabs/objects";
import { IStorageUtils, IStorageUtilsType } from "@snickerdoodlelabs/utils";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { SnickerdoodleIFrameProxy } from "@web-integration/implementations/proxy/SnickerdoodleIFrameProxy.js";
import { EProxyContainerID } from "@web-integration/interfaces/objects/enums/index.js";
import {
  IIFrameProxyFactory,
  ISnickerdoodleIFrameProxy,
} from "@web-integration/interfaces/proxy/index.js";

@injectable()
export class IFrameProxyFactory implements IIFrameProxyFactory {
  public constructor(
    @inject(IStorageUtilsType) protected storageUtils: IStorageUtils,
  ) {}

  public createProxy(
    iframeUrl: URLString,
    configOverrides: IConfigOverrides,
  ): ResultAsync<ISnickerdoodleIFrameProxy, ProxyError> {
    const proxy = new SnickerdoodleIFrameProxy(
      this._prepareIFrameContainer(),
      iframeUrl,
      "snickerdoodle-core-iframe",
      configOverrides,
      this.storageUtils,
    );

    return proxy.activate().map(() => {
      return proxy;
    });
  }

  private _prepareIFrameContainer(): HTMLElement {
    // Create a container element for the iframe proxy
    const iframeContainer = document.createElement("div");
    iframeContainer.id = EProxyContainerID.ROOT;
    const style = document.createElement("style");
    style.appendChild(
      document.createTextNode(`
            iframe {
              display: none;
            }
        `),
    );
    document.head.appendChild(style);

    // Attach everything to the body
    document.body.appendChild(iframeContainer);

    return iframeContainer;
  }
}
