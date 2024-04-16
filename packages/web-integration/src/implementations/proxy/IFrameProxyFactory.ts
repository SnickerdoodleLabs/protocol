import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import {
  IConfigOverrides,
  ProxyError,
  URLString,
} from "@snickerdoodlelabs/objects";
import { IStorageUtils, IStorageUtilsType } from "@snickerdoodlelabs/utils";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

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
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public createProxy(
    iframeUrl: URLString,
    configOverrides: IConfigOverrides,
  ): ResultAsync<ISnickerdoodleIFrameProxy, ProxyError> {
    return ResultUtils.backoffAndRetry(
      () => {
        const iframeContainer = this._prepareIFrameContainer();
        const proxy = new SnickerdoodleIFrameProxy(
          iframeContainer,
          iframeUrl,
          "snickerdoodle-core-iframe",
          configOverrides,
          this.storageUtils,
        );

        return proxy
          .activate()
          .map(() => {
            return proxy;
          })
          .mapErr((e) => {
            iframeContainer.remove();
            return e;
          });
      },
      [ProxyError], // Retry after a ProxyError
      3, // We'll give it 3 tries
    ).mapErr((e) => {
      this.logUtils.error(
        `Unable to create iframe proxy after 3 attempts. Please reload the page.`,
      );
      return e;
    });
  }

  private _prepareIFrameContainer(): HTMLElement {
    // Create a container element for the iframe proxy
    const iframeContainer = document.createElement("div");
    iframeContainer.id = EProxyContainerID.ROOT;
    const style = document.createElement("style");
    style.appendChild(
      document.createTextNode(`
            #${EProxyContainerID.ROOT} {
              position: fixed;
              display: none;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              z-index: 999999999;
            }
            iframe[name="snickerdoodle-core-iframe"] {
              display: none;
              width: 100%;
              height: 100%;
              border: none;
              background-color: transparent;
            }
        `),
    );
    document.head.appendChild(style);

    // Attach everything to the body
    document.body.appendChild(iframeContainer);

    return iframeContainer;
  }
}
