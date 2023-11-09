import "reflect-metadata";
import { IWebIntegrationConfigOverrides } from "@snickerdoodlelabs/objects";
import { SnickerdoodleWebIntegration } from "@snickerdoodlelabs/web-integration";
import { Signer } from "ethers";
import { ResultAsync, okAsync } from "neverthrow";
import { WCProvider } from "./WCProvider";
export class integrateSnickerdoodle {
  coreConfig: IWebIntegrationConfigOverrides;
  webIntegration: SnickerdoodleWebIntegration | undefined;
  WCProvider: WCProvider | undefined;
  constructor(coreConfig) {
    this.coreConfig = coreConfig;
    this.WCProvider = new WCProvider(coreConfig.walletConnect.projectId);
    this.WCProvider.checkConnection().map((connected) => {
      if (connected) {
        this.startSessionIntegration();
      }
    });
  }
  async startSessionIntegration() {
    const signer = await this.WCProvider?.getEthersSigner();
    console.log("signer4", signer);
  }
}
