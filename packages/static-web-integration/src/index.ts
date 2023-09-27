import "reflect-metadata";
import { IConfigOverrides, URLString } from "@snickerdoodlelabs/objects";
import { SnickerdoodleWebIntegration } from "@snickerdoodlelabs/web-integration";
import { Signer } from "ethers";
import { ResultAsync, okAsync } from "neverthrow";

import { WalletProvider } from "@static-web-integration/WalletProvider";
import { WCProvider } from "@static-web-integration/WCProvider";

declare const __LOGO_PATH__: URLString;

export function integrateSnickerdoodle(coreConfig: IConfigOverrides): void {
  checkConnections(coreConfig)
    .map((connected) => {
      if (connected) {
        startIntegration(coreConfig).mapErr((e) => {
          console.error("Error starting integration:", e);
        });
      } else {
        // Create a floating div with the snickerdoodle logo
        const fixie = document.createElement("img");
        fixie.src = __LOGO_PATH__;
        fixie.id = "snickerdoodle-fixie";
        fixie.style.position = "fixed";
        fixie.style.top = "calc(100vh - 130px)";
        fixie.style.right = "30px";
        fixie.style.width = "100px";
        fixie.style.height = "100px";
        fixie.onclick = () => {
          startIntegration(coreConfig)
            .map(() => {
              fixie?.style.setProperty("display", "none");
            })
            .mapErr((e) => {
              console.error("Error starting integration:", e);
            });
        };
        document.body.appendChild(fixie);
      }
    })
    .mapErr((e) => {
      console.error("CheckConnection Error:", e);
    });
}

function startIntegration(coreConfig: IConfigOverrides) {
  return getSigner(coreConfig)
    .andThen((signerResult) => {
      const webIntegration = new SnickerdoodleWebIntegration(
        coreConfig,
        signerResult,
      );

      return webIntegration.initialize().andThen((dataWallet) => {
        console.log("Snickerdoodle Data Wallet Initialized");
        return okAsync(undefined);
      });
    })
    .mapErr((e) => {
      console.error("An error occurred:", e);
    });
}

function getSigner(coreConfig: IConfigOverrides): ResultAsync<Signer, Error> {
  if (!coreConfig.walletConnect?.projectId) {
    const walletProvider = new WalletProvider();

    return ResultAsync.fromPromise(
      walletProvider.connect(),
      (e) => new Error(`Failed to connect wallet: ${(e as Error).message}`),
    ).map(() => {
      return walletProvider.signer;
    });
  }

  const newWalletProvider = new WCProvider();
  return newWalletProvider
    .init(coreConfig.walletConnect?.projectId as string)
    .andThen(() => {
      return newWalletProvider.getSigner();
    });
}

function checkConnections(
  coreConfig: IConfigOverrides,
): ResultAsync<boolean, unknown> {
  if (!coreConfig.walletConnect?.projectId) {
    const walletProvider = new WalletProvider();

    return walletProvider.checkConnection().map((connection) => {
      return connection;
    });
  }

  const newWalletProvider = new WCProvider();
  return newWalletProvider.checkConnection(coreConfig.walletConnect?.projectId);
}
