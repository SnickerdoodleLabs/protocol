import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import {
  AccountAddress,
  BlockchainProviderError,
  ChainId,
  EChain,
  EVMAccountAddress,
  IConfigOverrides,
  ISdlDataWallet,
  PersistenceError,
  ProxyError,
  Signature,
  URLString,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { Container } from "inversify";
import { ResultAsync, okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { ISnickerdoodleWebIntegration } from "@web-integration/interfaces/app/index.js";
import {
  IIFrameProxyFactory,
  IIFrameProxyFactoryType,
} from "@web-integration/interfaces/proxy/index.js";
import { webIntegrationModule } from "@web-integration/WebIntegrationModule.js";

export class SnickerdoodleWebIntegration
  implements ISnickerdoodleWebIntegration {
  protected iframeURL = URLString("http://localhost:9010");
  protected debug = false;
  protected iocContainer: Container;

  protected _core: ISdlDataWallet | null = null;

  protected initializeResult: ResultAsync<
    ISdlDataWallet,
    ProxyError | PersistenceError | BlockchainProviderError
  > | null = null;

  constructor(
    protected config: IConfigOverrides,
    protected signer: ethers.Signer,
  ) {
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
  public initialize(): ResultAsync<
    ISdlDataWallet,
    ProxyError | PersistenceError | BlockchainProviderError
  > {
    if (this.initializeResult != null) {
      return this.initializeResult;
    }

    const logUtils = this.iocContainer.get<ILogUtils>(ILogUtilsType);

    logUtils.log("Activating Snickerdoodle Core web integration");

    // Check if the proxy is already injected
    if (window.sdlDataWallet != null) {
      // If there's already a proxy injected, we don't need to create a new one
      logUtils.log("Existing Snickerdoodle injected proxy on the page");
      this._core = window.sdlDataWallet;
      logUtils.log("Snickerdoodle Core web integration activated");
      this.initializeResult = okAsync(window.sdlDataWallet);
      return this.initializeResult;
    }

    // No proxy injected, create a new one via the iframe
    // Create a proxy connection to the iframe
    logUtils.log("Creating Snickerdoodle Protocol Iframe Proxy");
    const proxyFactory = this.iocContainer.get<IIFrameProxyFactory>(
      IIFrameProxyFactoryType,
    );

    this.initializeResult = proxyFactory
      .createProxy(this.iframeURL, this.config)
      .andThen((proxy) => {
        // Listen for the iframe; sometimes it needs to be shown
        proxy.onIframeDisplayRequested.subscribe(() => {
          logUtils.warning("IFrame display requested");
        });

        return ResultUtils.combine([
          proxy.getAccounts(),
          this.getAccountAddress(),
        ])
          .andThen(([linkedAccounts, accountAddress]) => {
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
              `Detected unlinked account ${accountAddress} being used on the DApp, suggesting adding to Snickerdoodle Data Wallet`,
            );
            return proxy.suggestAddAccount(accountAddress);
          })
          .map(() => {
            // Assign the iframe proxy to the internal reference and the window object
            this._core = proxy;
            window.sdlDataWallet = this.core;
            logUtils.log("Snickerdoodle Core web integration activated");
            return proxy;
          });
      });

    return this.initializeResult;
  }

  protected getAccountAddress(): ResultAsync<
    AccountAddress,
    BlockchainProviderError
  > {
    return ResultAsync.fromPromise(this.signer.getAddress(), (e) => {
      return new BlockchainProviderError(
        ChainId(EChain.EthereumMainnet),
        "Unable to get address from signer",
        e,
      );
    }).map((address) => {
      // AccountAddress is a type alias and can't be used directly
      // TODO: Figure out how this would work with Solana
      return EVMAccountAddress(address);
    });
  }

  protected getSignature(
    message: string,
  ): ResultAsync<Signature, BlockchainProviderError> {
    return ResultAsync.fromPromise(this.signer.signMessage(message), (e) => {
      return new BlockchainProviderError(
        ChainId(EChain.EthereumMainnet),
        "Unable to sign message",
        e,
      );
    }).map((signature) => Signature(signature));
  }
}

declare let window: {
  sdlDataWallet: ISdlDataWallet | undefined;
};
