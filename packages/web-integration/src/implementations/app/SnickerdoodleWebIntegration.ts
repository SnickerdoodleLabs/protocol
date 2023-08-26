import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import {
  IConfigOverrides,
  ISdlDataWallet,
  PersistenceError,
  ProviderRpcError,
  ProxyError,
  URLString,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { Container } from "inversify";
import { ResultAsync, okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { UIClient, IPalletteOverrides } from "@web-integration/implementations/app/ui/index.js";
import { ISnickerdoodleWebIntegration } from "@web-integration/interfaces/app/index.js";
import {
  IBlockchainProviderRepository,
  IBlockchainProviderRepositoryType,
} from "@web-integration/interfaces/data/index.js";
import {
  IIFrameProxyFactory,
  IIFrameProxyFactoryType,
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

  protected initializeResult: ResultAsync<
    ISdlDataWallet,
    ProxyError | PersistenceError | ProviderRpcError
  > | null = null;

  constructor(
    protected config: IConfigOverrides & { palette?: IPalletteOverrides },
    protected signer: ethers.Signer | null,
  ) {
    this.iframeURL = config.iframeURL || this.iframeURL;
    this.debug = config.debug || this.debug;

    this.iocContainer = new Container();

    // Elaborate syntax to demonstrate that we can use multiple modules
    this.iocContainer.load(...[webIntegrationModule]);

    // Set the config values that we need in the integration
    const configProvider =
      this.iocContainer.get<IConfigProvider>(IConfigProviderType);
    configProvider.setValues(this.signer, this.iframeURL);
  }

  public get core(): ISdlDataWallet {
    if (this._core == null) {
      throw new UninitializedError("Must call initialize() first");
    }
    return this._core;
  }

  // wait for the core to be intialized
  public initialize(): ResultAsync<
    ISdlDataWallet,
    ProxyError | PersistenceError | ProviderRpcError
  > {
    if (this.initializeResult != null) {
      return this.initializeResult;
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
        const startTime = Date.now();

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
            // Listen for the iframe; sometimes it needs to be shown
            proxy.onIframeDisplayRequested.subscribe(() => {
              logUtils.warning("IFrame display requested");
            });

            // Assign the iframe proxy to the internal reference and the window object
            this._core = proxy;
            window.sdlDataWallet = this.core;
            const uiClient = new UIClient(proxy, this.config.palette);
            uiClient.register();
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
          return proxy;
        });
      })
      .mapErr((e) => {
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
  ): ResultAsync<void, ProxyError | PersistenceError | ProviderRpcError> {
    return ResultUtils.combine([
      proxy.getAccounts(),
      blockchainProvider.getCurrentAccount(),
      blockchainProvider.getCurrentChain(),
    ]).andThen(([linkedAccounts, accountAddress, chainInfo]) => {
      // If we can't get stuff from the blockchain provider, we can't possibly add
      // an account
      if (accountAddress == null || chainInfo == null) {
        return okAsync(undefined);
      }

      // Check if the account that is linked to the page is linked to the data wallet
      const existingAccount = linkedAccounts.find((linkedAccount) => {
        return linkedAccount.sourceAccountAddress == accountAddress;
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

      return proxy
        .getLinkAccountMessage()
        .andThen((unlockMessage) => {
          return blockchainProvider.getSignature(unlockMessage);
        })
        .andThen((signature) => {
          const config = configProvider.getConfig();
          return proxy.addAccount(
            accountAddress,
            signature,
            chainInfo.chain,
            config.languageCode,
          );
        });
    });
  }
}

declare let window: {
  sdlDataWallet: ISdlDataWallet | undefined;
};
