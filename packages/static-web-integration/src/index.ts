import "reflect-metadata";
import { IWebIntegrationConfigOverrides } from "@snickerdoodlelabs/objects";
import { SnickerdoodleWebIntegration } from "@snickerdoodlelabs/web-integration";
import { ResultAsync, errAsync, okAsync } from "neverthrow";
import { WCProvider } from "@static-web-integration/WCProvider";

export class SnickerdoodleIntegration {
  coreConfig: IWebIntegrationConfigOverrides;
  webIntegration: SnickerdoodleWebIntegration | undefined;
  WCProvider: WCProvider;

  constructor(coreConfig) {
    this.coreConfig = coreConfig;
    this.WCProvider = new WCProvider(coreConfig.walletConnect.projectId);
  }

  protected startSessionIntegration() {
    return this.WCProvider.getEthersSigner()
      .andThen((signer) => {
        this.webIntegration = new SnickerdoodleWebIntegration(
          this.coreConfig,
          signer,
        );
        return this.webIntegration.initialize();
      })
      .map(() => {})
      .mapErr((error) => {
        console.error("Integration failed:", error);
        return error;
      });
  }

  protected startIntegration() {
    return this.WCProvider.startWalletConnect()
      .andThen((signer) => {
        this.webIntegration = new SnickerdoodleWebIntegration(
          this.coreConfig,
          signer,
        );
        return this.webIntegration.initialize().map(() => {});
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
  public integrateSnickerdoodle(): ResultAsync<void, Error> {
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
