import { ISdlDataWallet } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { SnickerdoodleIFrameProxy } from "@web-integration/implementations/proxy/index.js";
import { ISnickerdoodleWebIntegration } from "@web-integration/interfaces/app/index.js";

export class SnickerdoodleWebIntegration
  implements ISnickerdoodleWebIntegration
{
  protected iframeURL = "http://localhost:9010";
  protected _core: SnickerdoodleIFrameProxy;

  protected debug = false;
  protected initializeResult: ResultAsync<ISdlDataWallet, Error> | null = null;

  constructor(iframeURL: string | null, debug: boolean | null) {
    const iframeURLWithSearchParams = new URL(iframeURL || this.iframeURL);

    if (debug != null) {
      iframeURLWithSearchParams.searchParams.append("debug", debug.toString());
    }
    this.iframeURL = iframeURLWithSearchParams.toString();
    this.debug = debug || this.debug;

    if (window.snickerdoodle) {
      // If there's already a proxy injected, we don't need to create a new one
      this._core = window.snickerdoodle;
    } else {
      // Create a proxy connection to the iframe
      this._core = new SnickerdoodleIFrameProxy(
        this._prepareIFrameContainer(),
        this.iframeURL,
        "snickerdoodle-core-iframe",
      );
    }
  }

  public get core(): SnickerdoodleIFrameProxy {
    return this._core;
  }

  // wait for the core to be intialized
  public initialize(): ResultAsync<ISdlDataWallet, Error> {
    if (this.initializeResult == null) {
      console.log("Activating Snickerdoodle Core web integration");
      this.initializeResult = this._core.activate().map(() => {
        console.log("Snickerdoodle Core web integration activated");
        window.snickerdoodle = this.core;
        return this.core;
      });
    }

    return this.initializeResult;
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

declare let window: any;
