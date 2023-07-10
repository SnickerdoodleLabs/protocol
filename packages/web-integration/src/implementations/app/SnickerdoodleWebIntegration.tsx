import { ISnickerdoodleCore } from "@snickerdoodlelabs/objects";
import SnickerdoodleIFrameProxy from "@web-integration/implementations/proxy/index.js";
import { okAsync, ResultAsync } from "neverthrow";
import { Subject } from "rxjs";

import { ISnickerdoodleWebIntegration } from "@web-integration/interfaces/app/index.js";

export default class HypernetWebIntegration
  implements ISnickerdoodleWebIntegration
{
  protected iframeURL = "http://localhost:5020";
  protected defaultGovernanceChainId = 1337;
  protected debug = false;
  protected currentGatewayUrl: GatewayUrl | undefined | null;
  protected selectedStateChannel: ActiveStateChannel = {} as ActiveStateChannel;
  protected getReadyResolved = false;
  protected getRegistriesReadyResolved = false;
  protected getGovernanceReadyResolved = false;
  protected getPaymentsReadyResolved = false;
  protected paymentsInitializing = false;

  public webUIClient: IHypernetWebUI;
  public core: SnickerdoodleIFrameProxy;
  public UIData: IUIData;

  constructor(
    iframeURL: string | null,
    defaultGovernanceChainId: number | null,
    theme: Theme | null,
    debug: boolean | null,
  ) {
    const iframeURLWithSearchParams = new URL(iframeURL || this.iframeURL);

    if (defaultGovernanceChainId != null) {
      iframeURLWithSearchParams.searchParams.append(
        "defaultGovernanceChainId",
        defaultGovernanceChainId.toString(),
      );
    }

    if (debug != null) {
      iframeURLWithSearchParams.searchParams.append("debug", debug.toString());
    }
    this.iframeURL = iframeURLWithSearchParams.toString();
    this.debug = debug || this.debug;
    this.defaultGovernanceChainId =
      defaultGovernanceChainId || this.defaultGovernanceChainId;

    // Create a proxy connection to the iframe
    this.core = new SnickerdoodleIFrameProxy(
      this._prepareIFrameContainer(),
      this.iframeURL,
      "hypernet-core-iframe",
    );

    this.UIData = {
      onSelectedStateChannelChanged: new Subject<ActiveStateChannel>(),
      onVotesDelegated: new Subject<void>(),
      onProviderIdProvided: new Subject<void>(),
      getSelectedStateChannel: () => this.selectedStateChannel,
    };

    this.UIData.onSelectedStateChannelChanged.subscribe((stateChannel) => {
      this.selectedStateChannel = stateChannel;
    });

    this.UIData.onProviderIdProvided.subscribe(() => {
      // Render payments instuction only if getPaymentsReady is being called
      if (this.paymentsInitializing === true) {
        this.webUIClient.payments.renderPaymentsMetamaskInstructionsWidget({
          showInModal: true,
        });
      }
    });

    if (window.hypernetWebUIInstance) {
      this.webUIClient = window.hypernetWebUIInstance as IHypernetWebUI;
    } else {
      this.webUIClient = new HypernetWebUI(
        this.core,
        this.UIData,
        this.iframeURL,
        this.defaultGovernanceChainId,
        theme,
        this.debug,
      );
    }

    this.core.onGatewayIFrameDisplayRequested.subscribe((gatewayUrl) => {
      this.currentGatewayUrl = gatewayUrl;
    });

    this.core.onPrivateCredentialsRequested.subscribe(() => {
      //this.webUIClient.renderPrivateKeysModal();
      this.webUIClient.renderMetamaskWarningModal();
    });

    this.core.onWalletConnectOptionsDisplayRequested.subscribe(() => {
      this.webUIClient.renderWalletConnectWidget({ showInModal: true });
    });
  }

  // wait for the core to be intialized
  public getReady(): ResultAsync<ISnickerdoodleCore, Error> {
    if (this.getReadyResolved === true) {
      return okAsync(this.core);
    }
    return this.core
      .activate()
      .andThen(() => this.core.initialize())
      .map(() => {
        this.getReadyResolved = true;
        window.hypernetCoreInstance = this.core;
        return this.core;
      })
      .mapErr((err) => {
        this.webUIClient.renderWarningAlertModal(
          `an error occurred during initialization of hypernet core${
            err?.message ? `: ${err?.message}` : "."
          }`,
        );
        return new Error("Something went wrong!");
      });
  }

  public getRegistriesReady(): ResultAsync<ISnickerdoodleCore, Error> {
    if (this.getRegistriesReadyResolved === true) {
      return okAsync(this.core);
    }
    return this.core
      .activate()
      .andThen(() => this.core.registries.initializeRegistries())
      .map(() => {
        this.getRegistriesReadyResolved = true;
        window.hypernetCoreInstance = this.core;
        return this.core;
      })
      .mapErr((err) => {
        this.webUIClient.renderWarningAlertModal(
          `an error occurred during registries initialization of hypernet core${
            err?.message ? `: ${err?.message}` : "."
          }`,
        );
        return new Error("Something went wrong!");
      });
  }

  public getGovernanceReady(): ResultAsync<ISnickerdoodleCore, Error> {
    if (this.getGovernanceReadyResolved === true) {
      return okAsync(this.core);
    }
    return this.core
      .activate()
      .andThen(() => this.core.governance.initializeGovernance())
      .map(() => {
        this.getGovernanceReadyResolved = true;
        window.hypernetCoreInstance = this.core;
        return this.core;
      })
      .mapErr((err) => {
        this.webUIClient.renderWarningAlertModal(
          `an error occurred during governance initialization of hypernet core${
            err?.message ? `: ${err?.message}` : "."
          }`,
        );
        return new Error("Something went wrong!");
      });
  }

  public getPaymentsReady(): ResultAsync<ISnickerdoodleCore, Error> {
    this.paymentsInitializing = true;
    if (this.getPaymentsReadyResolved === true) {
      this.paymentsInitializing = false;
      return okAsync(this.core);
    }
    return this.core
      .activate()
      .andThen(() => this.core.payments.initializePayments())
      .map(() => {
        this.getPaymentsReadyResolved = false;
        this.paymentsInitializing = false;
        window.hypernetCoreInstance = this.core;
        return this.core;
      })
      .mapErr((err) => {
        this.webUIClient.renderWarningAlertModal(
          `an error occurred during payments initialization of hypernet core${
            err?.message ? `: ${err?.message}` : "."
          }`,
        );
        this.paymentsInitializing = false;
        return new Error("Something went wrong!");
      });
  }

  public displayGatewayIFrame(gatewayUrl: GatewayUrl): void {
    this.core.payments.displayGatewayIFrame(gatewayUrl);
  }

  public closeGatewayIFrame(gatewayUrl: GatewayUrl): void {
    this.core.payments.closeGatewayIFrame(gatewayUrl);
  }

  private _prepareIFrameContainer(): HTMLElement {
    // Create a container element for the iframe proxy
    const iframeContainer = document.createElement("div");
    iframeContainer.id = "__hypernet-protocol-iframe-container__";

    // Add close modal icon to iframe container
    const closeButton = document.createElement("div");
    closeButton.id = "__hypernet-protocol-iframe-close-icon__";
    closeButton.innerHTML = `
      <img id="__hypernet-protocol-iframe-close-img__" src="https://storage.googleapis.com/hypernetlabs-public-assets/hypernet-protocol/Close-big.png" width="20" />
    `;
    iframeContainer.appendChild(closeButton);

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
        #__hypernet-protocol-iframe-container__ {
          position: fixed;
          display: none;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          background-color: rgba(0,0,0,0.6);
          z-index: 999999 !important;
        }
        #__hypernet-protocol-iframe-close-icon__ {
          z-index: 2;
          position: absolute;
          height: 60%;
          top: 50%;
          left: 50%;
          transform: translate(calc(-50% + 263px), -50%);
        }
        #__hypernet-protocol-iframe-close-img__{
          cursor: pointer;
        }
    `),
    );
    document.head.appendChild(style);

    // Attach everything to the body
    document.body.appendChild(iframeContainer);

    const closeImg = document.getElementById(
      "__hypernet-protocol-iframe-close-img__",
    );

    closeImg?.addEventListener(
      "click",
      (e) => {
        if (this.currentGatewayUrl != null) {
          this.core.payments.closeGatewayIFrame(this.currentGatewayUrl);
          this.currentGatewayUrl = null;
        }
        iframeContainer.style.display = "none";
      },
      false,
    );

    return iframeContainer;
  }
}

declare let window: any;

window.HypernetWebIntegration = HypernetWebIntegration;
