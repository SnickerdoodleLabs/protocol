import "reflect-metadata";
import {
  EInvitationStatus,
  EVMContractAddress,
  IConfigOverrides,
  URLString,
} from "@snickerdoodlelabs/objects";
import { SnickerdoodleWebIntegration } from "@snickerdoodlelabs/web-integration";
import { WalletProvider } from "@static-web-integration/WalletProvider";
import { Result, ResultAsync, errAsync, okAsync } from "neverthrow";
import { WCProvider } from "@static-web-integration/WCProvider";
import { Signer } from "ethers";

declare const __LOGO_PATH__: URLString;

export function integrateSnickerdoodle(
  coreConfig: IConfigOverrides,
  consentContract?: EVMContractAddress,
): void {
  checkConnections(coreConfig)
    .map((connected) => {
      if (connected) {
        startIntegration(coreConfig, consentContract).mapErr((e) => {
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
          startIntegration(coreConfig, consentContract)
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

function startIntegration(
  coreConfig: IConfigOverrides,
  consentContractAddress?: EVMContractAddress,
) {
  return getSigner(coreConfig)
    .andThen((signerResult) => {
      const webIntegration = new SnickerdoodleWebIntegration(
        coreConfig,
        signerResult,
      );

      return webIntegration.initialize().andThen((dataWallet) => {
        console.log("Snickerdoodle Data Wallet Initialized");
        if (consentContractAddress != null) {
          return dataWallet
            .checkInvitationStatus(consentContractAddress)
            .andThen((invitationStatus) => {
              if (invitationStatus === EInvitationStatus.New) {
                return dataWallet.acceptInvitation([], consentContractAddress);
              }
              return okAsync(undefined);
            });
        }
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
): ResultAsync<boolean, never> {
  if (!coreConfig.walletConnect?.projectId) {
    const walletProvider = new WalletProvider();

    return walletProvider.checkConnection().map((connection) => {
      return connection;
    });
  }

  const newWalletProvider = new WCProvider();
  return newWalletProvider.checkConnection(coreConfig.walletConnect?.projectId);
}
