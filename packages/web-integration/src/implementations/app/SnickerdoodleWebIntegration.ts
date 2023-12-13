import "reflect-metadata";
import {
  ILogUtils,
  ILogUtilsType,
  ITimeUtils,
  ITimeUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  ISdlDataWallet,
  PersistenceError,
  ProviderRpcError,
  ProxyError,
  URLString,
  UninitializedError,
  MillisecondTimestamp,
  IWebIntegrationConfigOverrides,
  ECoreProxyType,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { Container } from "inversify";
import { ResultAsync, errAsync, okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { URLChangeObserver } from "@web-integration/implementations/utilities/index.js";
import { ISnickerdoodleWebIntegration } from "@web-integration/interfaces/app/index.js";
import { WebIntegrationEvents } from "@web-integration/interfaces/objects/index.js";
import {
  IBlockchainProviderRepository,
  IBlockchainProviderRepositoryType,
} from "@web-integration/interfaces/data/index.js";
import {
  IIFrameProxyFactory,
  IIFrameProxyFactoryType,
  ISnickerdoodleIFrameProxy,
} from "@web-integration/interfaces/proxy/index.js";
import {
  IConfigProvider,
  IConfigProviderType,
} from "@web-integration/interfaces/utilities/index.js";
import { webIntegrationModule } from "@web-integration/WebIntegrationModule.js";
export class SnickerdoodleWebIntegration
  implements ISnickerdoodleWebIntegration
{
  protected iframeURL = URLString("https://iframe.snickerdoodle.com");
  protected debug = false;
  protected iocContainer: Container;

  protected _core: ISdlDataWallet | null = null;
  protected timeUtils: ITimeUtils;

  protected startTimestamp: MillisecondTimestamp;

  protected initializeResult: ResultAsync<
    ISdlDataWallet,
    ProxyError | PersistenceError | ProviderRpcError
  > | null = null;

  protected _events: WebIntegrationEvents;

  constructor(
    protected config: IWebIntegrationConfigOverrides,
    protected signer?: ethers.Signer | null,
  ) {
    this.iframeURL = config.iframeURL || this.iframeURL;
    this.debug = config.debug || this.debug;

    this.iocContainer = new Container();
    this._events = new WebIntegrationEvents();

    // Elaborate syntax to demonstrate that we can use multiple modules
    this.iocContainer.load(...[webIntegrationModule]);

    // Set the config values that we need in the integration
    const configProvider =
      this.iocContainer.get<IConfigProvider>(IConfigProviderType);
    configProvider.setValues(this.signer ?? null, this.iframeURL);

    this.timeUtils = this.iocContainer.get<ITimeUtils>(ITimeUtilsType);
    this.startTimestamp = this.timeUtils.getMillisecondNow();
  }

  public get core(): ISdlDataWallet {
    if (this._core == null) {
      throw new UninitializedError("Must call initialize() first");
    }
    return this._core;
  }

  public get events() {
    return this._events;
  }

  // wait for the core to be intialized
  public initialize(): ResultAsync<
    ISdlDataWallet,
    ProxyError | PersistenceError | ProviderRpcError
  > {
    if (this.initializeResult != null) {
      return this.initializeResult;
    } else if (window.sdlDataWalletInitializeAttempted) {
      return errAsync(
        new ProxyError(
          "Snickedoodle Web Integration initialize() has already been called via another instance",
        ),
      );
    } else {
      window.sdlDataWalletInitializeAttempted = true;
    }

    const logUtils = this.iocContainer.get<ILogUtils>(ILogUtilsType);
    const blockchainProvider =
      this.iocContainer.get<IBlockchainProviderRepository>(
        IBlockchainProviderRepositoryType,
      );
    const configProvider =
      this.iocContainer.get<IConfigProvider>(IConfigProviderType);

    logUtils.log("Activating Snickerdoodle Core web integration");

    const proxyFactory = this.iocContainer.get<IIFrameProxyFactory>(
      IIFrameProxyFactoryType,
    );

    this.initializeResult = ResultAsync.fromSafePromise(
      new Promise<ISdlDataWallet | undefined>((resolve) => {
        const maxResolveTime = 2000;
        const checkInterval = 200;
        const startTime = this.timeUtils.getMillisecondNow();

        function checkWindow() {
          if (typeof window.sdlDataWallet !== "undefined") {
            console.log("Existing Snickerdoodle injected proxy on the page");
            resolve(window.sdlDataWallet);
          } else {
            const elapsedTime = Date.now() - startTime;
            if (elapsedTime >= maxResolveTime) {
              resolve(undefined);
            } else {
              // If the maximum time has not elapsed, continue checking
              setTimeout(checkWindow, checkInterval);
            }
          }
        }
        // Start the initial check
        checkWindow();
      }),
    )
      .andThen((existingProxy) => {
        if (existingProxy) {
          this._core = existingProxy;
          return okAsync(existingProxy);
        }
        // No proxy injected, create a new one via the iframe
        // Create a proxy connection to the iframe
        console.log("Creating Snickerdoodle Protocol Iframe Proxy");
        return proxyFactory
          .createProxy(this.iframeURL, this.config)
          .map((proxy) => {
            // initialize the URL change observer
            new URLChangeObserver(proxy.checkURLForInvitation.bind(proxy));
            // Subscribe to the keydown event for displaying the dashboard only for the iframe proxy
            this.subscribeToKeyDownEvent();
            // Assign the iframe proxy to the internal reference and the window object
            this._core = proxy;
            window.sdlDataWallet = this.core;
            return proxy;
          });
      })
      .andThen((proxy) => {
        logUtils.log("Snickerdoodle Core web integration activated");
        // Just double check that it's not already unlocked
        return this.checkAdditionalAccount(
          proxy,
          logUtils,
          blockchainProvider,
          configProvider,
        ).map(() => {
          const startupCompleteTime = this.timeUtils.getMillisecondNow();
          logUtils.warning(
            `Completed starting iframe in ${
              startupCompleteTime - this.startTimestamp
            }ms`,
          );
          // notify the outside world that the proxy has been initialized
          this._events.onInitialized.next(proxy.proxyType);
          return proxy;
        });
      })
      .mapErr((e) => {
        // Reset the initialize flag so that we can try again
        window.sdlDataWalletInitializeAttempted = undefined;
        logUtils.error(e);
        return e;
      });

    return this.initializeResult;
  }

  protected checkAdditionalAccount(
    proxy: ISdlDataWallet,
    logUtils: ILogUtils,
    blockchainProvider: IBlockchainProviderRepository,
    configProvider: IConfigProvider,
  ): ResultAsync<void, never> {
    const config = configProvider.getConfig();

    // If we were not given a signer, we can't possibly add an account automatically
    if (config.signer == null) {
      return okAsync(undefined);
    }

    console.debug(
      "Signer provided, checking if account is already linked to the data wallet",
    );
    return ResultUtils.combine([
      proxy.account.getAccounts(),
      blockchainProvider.getCurrentAccount(),
      blockchainProvider.getCurrentChain(),
    ])
      .andThen(([linkedAccounts, accountAddress, chainInfo]) => {
        // If we can't get stuff from the blockchain provider, we can't possibly add
        // an account
        if (accountAddress == null || chainInfo == null) {
          return okAsync(undefined);
        }

        // Check if the account that is linked to the page is linked to the data wallet
        const existingAccount = linkedAccounts.find((linkedAccount) => {
          return (
            linkedAccount.sourceAccountAddress == accountAddress.toLowerCase()
          );
        });

        // Account is already linked, no need to do anything
        if (existingAccount != null) {
          return okAsync(undefined);
        }

        // The account the DApp is using is not linked to the
        // data wallet. We should add that account.
        logUtils.log(
          `Detected unlinked account ${accountAddress} being used on the DApp, adding to Snickerdoodle Data Wallet`,
        );

        return proxy.account
          .getLinkAccountMessage(config.languageCode)
          .andThen((unlockMessage) => {
            return blockchainProvider.getSignature(unlockMessage);
          })
          .andThen((signature) => {
            return proxy.account.addAccount(
              accountAddress,
              signature,
              config.languageCode,
              chainInfo.chain,
            );
          });
      })
      .orElse((error) => {
        // Check for an error, but don't do anything with it
        console.log("Error checking for additional account.Skipping ", error);
        return okAsync(undefined);
      });
  }

  public requestDashboardView(): void {
    return this._requestDashboardView();
  }

  protected subscribeToKeyDownEvent() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  protected handleKeyDown(event: KeyboardEvent) {
    if (event.key === "F9") {
      this._requestDashboardView();
    }
  }

  protected _requestDashboardView(): void {
    try {
      if (this._core?.requestDashboardView) {
        this._core.requestDashboardView();
      } else {
        throw new Error(
          "This method is not supported for sdlDataWallet injected by Snickerdoodle Extension",
        );
      }
    } catch (e) {
      console.log("Unable to display dashboard! e:", e);
    }
  }
}

declare let window: {
  sdlDataWallet: ISdlDataWallet | undefined;
  sdlDataWalletInitializeAttempted: boolean | undefined;
};
