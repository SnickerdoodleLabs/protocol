import {
  IConfigOverrides,
  ProxyError,
  URLString,
} from "@snickerdoodlelabs/objects";
import { IStorageUtils, IStorageUtilsType } from "@snickerdoodlelabs/utils";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { SnickerdoodleIFrameProxy } from "@web-integration/implementations/proxy/SnickerdoodleIFrameProxy.js";
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
    iframeContainer.id = "__snickerdoodle-protocol-iframe-container__";

    // Add close modal icon to iframe container
    // const closeButton = document.createElement("div");
    // closeButton.id = "__snickerdoodle-protocol-iframe-close-icon__";
    // closeButton.innerHTML = `
    //   <img id="__snickerdoodle-protocol-iframe-close-img__" src="https://storage.googleapis.com/snickerdoodle-public-assets/snickerdoodle-protocol/Close-big.png" width="20" />
    // `;
    // iframeContainer.appendChild(closeButton);

    // Add iframe modal style
    const style = document.createElement("style");
    style.appendChild(
      document.createTextNode(`
            iframe {
              position: absolute;
              display: none;
              border: none;
              width: 550px;
              height: 60%;
              min-height: 200px;
              background-color: white;
              top: 50%;
              left: 50%;
              box-shadow: 0px 4px 20px #000000;
              border-radius: 4px;
              transform: translate(-50%, -50%);
            }
            #__snickerdoodle-protocol-iframe-container__ {
              position: fixed;
              display: none;
              top: 0;
              left: 0;
              height: 100%;
              width: 100%;
              background-color: rgba(0,0,0,0.6);
              z-index: 999999 !important;
            }
            #__snickerdoodle-protocol-iframe-close-icon__ {
              z-index: 2;
              position: absolute;
              height: 60%;
              top: 50%;
              left: 50%;
              transform: translate(calc(-50% + 263px), -50%);
            }
            #__snickerdoodle-protocol-iframe-close-img__{
              cursor: pointer;
            }
        `),
    );
    document.head.appendChild(style);

    // Attach everything to the body
    document.body.appendChild(iframeContainer);

    const closeImg = document.getElementById(
      "__snickerdoodle-protocol-iframe-close-img__",
    );

    closeImg?.addEventListener(
      "click",
      (_event) => {
        iframeContainer.style.display = "none";
      },
      false,
    );

    return iframeContainer;
  }
}
