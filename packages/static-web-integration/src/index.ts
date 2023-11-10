import "reflect-metadata";
import {
  IWebIntegrationConfigOverrides,
  LanguageCode,
  ProviderRpcError,
} from "@snickerdoodlelabs/objects";
import { SnickerdoodleWebIntegration } from "@snickerdoodlelabs/web-integration";
import { Signer } from "ethers";
import { ResultAsync, errAsync, okAsync } from "neverthrow";
import { WCProvider } from "./WCProvider";
export class integrateSnickerdoodle {
  coreConfig: IWebIntegrationConfigOverrides;
  webIntegration: SnickerdoodleWebIntegration | undefined;
  WCProvider: WCProvider;
  constructor(coreConfig) {
    this.coreConfig = coreConfig;
    this.WCProvider = new WCProvider(coreConfig.walletConnect.projectId);
  }
  async startSessionIntegration() {
    const signer = await this.WCProvider?.getEthersSigner();
    this.webIntegration = new SnickerdoodleWebIntegration(
      this.coreConfig,
      signer,
    );
    this.webIntegration.initialize();
  }
  startIntegration() {
    return new SnickerdoodleWebIntegration(this.coreConfig)
      .initialize()
      .andThen((sdl) => {
        return sdl.account.getLinkAccountMessage(LanguageCode("en"));
      })
      .andThen((message) => {
        return ResultAsync.fromPromise(
          this.WCProvider.startWalletConnect(message).then((result) => {
            if (result instanceof Error) {
              throw new Error(result.message);
            }
            return result;
          }),
          (error) => {
            return new ProviderRpcError("WalletConnect start failed", error);
          },
        );
      })
      .andThen((signer) => {
        if (signer instanceof Signer) {
          this.webIntegration = new SnickerdoodleWebIntegration(
            this.coreConfig,
            signer,
          );
          return ResultAsync.fromSafePromise(
            Promise.resolve("Integration successful"),
          );
        } else {
          return errAsync(new TypeError("Signer validation failed"));
        }
      })
      .mapErr((error) => {
        console.error("Integration failed:", error);
        return error;
      });
  }
  start() {
    if (this.isConnected()) {
      this.startSessionIntegration();
    } else {
      this.startIntegration();
    }
  }
  isConnected() {
    return this.WCProvider.checkConnection();
  }
}
