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
        const buttonHtml = button.innerHTML;
        button.onclick = () => {
          this.start();
        };
        if (this.isConnected()) {
          this.changeButtonText(
            coreConfig.walletConnect.buttonId,
            "Disconnect",
          );
          setTimeout(() => {
            // setTimeout needed to make sure the session is connected and have WalletClient
            this.startSessionIntegration();
          }, 1000);
          button.onclick = () => {
            disconnect().then(() => {
              button.innerHTML = buttonHtml;
              button.onclick = () => {
                this.start();
              };
            });
          };
        }
      }
    }
  }
  private changeButtonText(buttonId: string, newText: string): void {
    const button = document.getElementById(buttonId);
    if (button && newText.trim() !== "") {
      const textNodes: Text[] = [];
      const walk = document.createTreeWalker(
        button,
        NodeFilter.SHOW_TEXT,
        null,
      );
      while (walk.nextNode()) {
        textNodes.push(walk.currentNode as Text);
      }

      // Update the text content of each text node
      textNodes.forEach((node) => {
        if (node.textContent && node.textContent?.trim().length > 0) {
          node.textContent = newText;
        }
      });
    }
  }
}
