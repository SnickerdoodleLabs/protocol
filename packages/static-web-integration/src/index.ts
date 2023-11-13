import "reflect-metadata";
import {
  IWebIntegrationConfigOverrides,
  LanguageCode,
  PersistenceError,
  ProviderRpcError,
  ProxyError,
} from "@snickerdoodlelabs/objects";
import { SnickerdoodleWebIntegration } from "@snickerdoodlelabs/web-integration";
import { ResultAsync, errAsync, okAsync } from "neverthrow";
import { WCProvider } from "./WCProvider";

export class SnickerdoodleIntegration {
  coreConfig: IWebIntegrationConfigOverrides;
  webIntegration: SnickerdoodleWebIntegration | undefined;
  WCProvider: WCProvider;

  constructor(coreConfig) {
    this.coreConfig = coreConfig;
    this.WCProvider = new WCProvider(coreConfig.walletConnect.projectId);
  }

  protected startSessionIntegration(): ResultAsync<void, Error> {
    return this.WCProvider.getEthersSigner().map((signer) => {
      this.webIntegration = new SnickerdoodleWebIntegration(
        this.coreConfig,
        signer,
      );
      this.webIntegration.initialize();
    });
  }

  protected startIntegration(): ResultAsync<
    void,
    ProxyError | PersistenceError | ProviderRpcError
  > {
    const webIntegration = new SnickerdoodleWebIntegration(this.coreConfig);
    return webIntegration
      .initialize()
      .andThen(() => {
        return webIntegration.core.account.getLinkAccountMessage(
          LanguageCode("en"),
        );
      })
      .andThen((message) => {
        return this.WCProvider.startWalletConnect(message).mapErr((error) => {
          return new ProviderRpcError("WalletConnect start failed", error);
        });
      })
      .map((signer) => {
        this.webIntegration = new SnickerdoodleWebIntegration(
          this.coreConfig,
          signer,
        );
      })
      .mapErr((error) => {
        console.error("Integration failed:", error);
        return error;
      });
  }

  public start(): ResultAsync<void, Error> {
    if (this.isConnected()) {
      return this.startSessionIntegration();
    } else {
      return this.startIntegration();
    }
  }

  public isConnected(): boolean {
    return this.WCProvider.checkConnection();
  }
}
