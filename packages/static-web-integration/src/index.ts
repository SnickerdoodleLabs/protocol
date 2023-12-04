import "reflect-metadata";
import { IWebIntegrationConfigOverrides } from "@snickerdoodlelabs/objects";
import { SnickerdoodleWebIntegration } from "@snickerdoodlelabs/web-integration";
import { ResultAsync, errAsync, okAsync } from "neverthrow";
import { WCProvider } from "@static-web-integration/WCProvider";
import { getAccount, disconnect } from "@wagmi/core";

export class SnickerdoodleIntegration {
  coreConfig: IWebIntegrationConfigOverrides;
  webIntegration: SnickerdoodleWebIntegration | undefined;
  WCProvider: WCProvider;

  constructor(coreConfig) {
    this.coreConfig = coreConfig;
    this.WCProvider = new WCProvider(coreConfig.walletConnect.projectId);
    this.handleHookIntegration(coreConfig);
  }

  protected startSessionIntegration() {
    return this.WCProvider.getEthersSigner()
      .andThen((signer) => {
        if (!this.webIntegration) {
          this.webIntegration = new SnickerdoodleWebIntegration(
            this.coreConfig,
            signer,
          );
        }

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
        if (!this.webIntegration) {
          this.webIntegration = new SnickerdoodleWebIntegration(
            this.coreConfig,
            signer,
          );
        }
        return this.webIntegration.initialize().map(() => {
          this.handleHookIntegration(this.coreConfig);
        });
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
  public getConnectedAddress(): string | undefined {
    return getAccount().address;
  }
  private async handleHookIntegration(
    coreConfig: IWebIntegrationConfigOverrides,
  ) {
    if (coreConfig.walletConnect && coreConfig.walletConnect.buttonId) {
      const button = document.getElementById(coreConfig.walletConnect.buttonId);
      if (button) {
        const buttonText = button?.innerHTML;
        button.onclick = () => {
          this.start();
        };
        if (this.isConnected()) {
          button.innerHTML = "Disconnect";
          setTimeout(() => {
            // setTimeout needed to make sure the session is connected and have WalletClient
            this.startSessionIntegration();
          }, 1000);
          button.onclick = () => {
            disconnect().then(() => {
              button.innerHTML = buttonText;
              button.onclick = () => {
                this.start();
              };
            });
          };
        }
      }
    }
  }
}
