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

import { ISnickerdoodleWebIntegration } from "@web-integration/interfaces/app/index.js";
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
  protected iframeURL = URLString("http://localhost:9010");
  protected debug = false;
  protected iocContainer: Container;

  protected _core: ISdlDataWallet | null = null;

  protected initializeResult: ResultAsync<
    ISdlDataWallet,
    ProxyError | PersistenceError | ProviderRpcError
  > | null = null;

  constructor(
    protected config: IConfigOverrides,
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
    ).andThen((existingProxy) => {
      if (existingProxy) {
        this._core = existingProxy;
        return okAsync(existingProxy);
      }
      // No proxy injected, create a new one via the iframe
      // Create a proxy connection to the iframe
      console.log("Creating Snickerdoodle Protocol Iframe Proxy");
      return proxyFactory
        .createProxy(this.iframeURL, this.config)
        .andThen((proxy) => {
          // Listen for the iframe; sometimes it needs to be shown
          proxy.onIframeDisplayRequested.subscribe(() => {
            logUtils.warning("IFrame display requested");
          });

          // @TODO we can register the ui client at this step

          const unlockPromise = new Promise((resolve) => {
            const config = configProvider.getConfig();
            // if signer is not provided resolve the unlock promise immediately
            // this usage will prevent account changes from being detected and forcing account unlocking
            if (!config.signer) {
              resolve(undefined);
            }
            // It can take a little while for the proxy to actually
            // unlock. We'll wait for it for a bit, and cancel it
            // if we hear that it's been initialized
            const timeout = setTimeout(() => {
              // If this actually fires, we are not interested in waiting for
              // the onInitialized event
              subscription.unsubscribe();

              // Just double check that it's not already unlocked
              this.unlockAndCheck(
                proxy,
                logUtils,
                blockchainProvider,
                configProvider,
              )
                .map(() => {
                  // All done unlocking
                  resolve(undefined);
                })
                .mapErr((e) => {
                  logUtils.error(e);
                });
            }, 5000); // Wait 5 seconds for the unlock to complete

            const subscription = proxy.events.onInitialized.subscribe(() => {
              // This event is fired when the proxy automatically unlocks
              clearTimeout(timeout);
              this.unlockAndCheck(
                proxy,
                logUtils,
                blockchainProvider,
                configProvider,
              )
                .map(() => {
                  // All done unlocking
                  resolve(undefined);
                })
                .mapErr((e) => {
                  logUtils.error(e);
                });
            });
          });

          return ResultAsync.fromSafePromise(unlockPromise).map(() => {
            // Assign the iframe proxy to the internal reference and the window object
            this._core = proxy;
            window.sdlDataWallet = this.core;
            logUtils.log("Snickerdoodle Core web integration activated");
            return proxy;
          });
        });
    });

    return this.initializeResult;
  }

  protected unlockWallet(
    proxy: ISnickerdoodleIFrameProxy,
    logUtils: ILogUtils,
    blockchainProvider: IBlockchainProviderRepository,
    configProvider: IConfigProvider,
  ): ResultAsync<void, ProxyError | PersistenceError | ProviderRpcError> {
    logUtils.log("Unlocking Snickerdoodle Data Wallet via signature");
    return proxy
      .getUnlockMessage()
      .andThen((unlockMessage) => {
        return ResultUtils.combine([
          blockchainProvider.getSignature(unlockMessage),
          blockchainProvider.getCurrentAccount(),
          blockchainProvider.getCurrentChain(),
        ]);
      })
      .andThen(([signature, accountAddress, chainInfo]) => {
        const config = configProvider.getConfig();
        if (accountAddress == null || chainInfo == null) {
          logUtils.error(
            "No signer provided and no stored credentials available. Cannot unlock data wallet",
          );
          return okAsync(undefined);
        }
        logUtils.log(`Unlocking data wallet for ${accountAddress}`);
        return proxy.unlock(
          accountAddress,
          signature,
          chainInfo.chain,
          config.languageCode,
        );
      });
  }

  protected checkAdditionalAccount(
    proxy: ISnickerdoodleIFrameProxy,
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
        .getUnlockMessage()
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

  protected unlockAndCheck(
    proxy: ISnickerdoodleIFrameProxy,
    logUtils: ILogUtils,
    blockchainProvider: IBlockchainProviderRepository,
    configProvider: IConfigProvider,
  ) {
    return proxy.metrics
      .getUnlocked()
      .andThen((unlocked) => {
        // If it's already unlocked, we don't need to do anything
        if (unlocked) {
          logUtils.debug(
            "Snickerdoodle Data Wallet is already unlocked via stored credentials",
          );
          return okAsync(undefined);
        }

        // It's not unlocked, which means we need to unlock it
        return this.unlockWallet(
          proxy,
          logUtils,
          blockchainProvider,
          configProvider,
        );
      })
      .andThen(() => {
        return this.checkAdditionalAccount(
          proxy,
          logUtils,
          blockchainProvider,
          configProvider,
        );
      });
  }
}

declare let window: {
  sdlDataWallet: ISdlDataWallet | undefined;
};
