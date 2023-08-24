//@ts-nocheck
import "reflect-metadata";
import {
  EInvitationStatus,
  EVMContractAddress,
  IConfigOverrides,
  URLString,
} from "@snickerdoodlelabs/objects";
import { SnickerdoodleWebIntegration } from "@snickerdoodlelabs/web-integration";
import { WalletProvider } from "@static-web-integration/WalletProvider";
import WCProvider from "@static-web-integration/WCProvider";

declare const __LOGO_PATH__: URLString;

export function integrateSnickerdoodle(
  coreConfig: IConfigOverrides,
  consentContract?: EVMContractAddress,
): void {
  // Create a floating div with the snickerdoodle logo
  const fixie = document.createElement("img");
  fixie.id = "snickerdoodle-logo";
  fixie.src = __LOGO_PATH__;
  fixie.style.position = "fixed";
  fixie.style.bottom = "30px";
  fixie.style.right = "30px";
  fixie.style.width = "100px";
  fixie.style.height = "100px";
  fixie.onclick = () => {
    startIntegration(coreConfig, consentContract);
  };
  document.body.appendChild(fixie);
}

async function startIntegration(
  coreConfig: IConfigOverrides,
  consentContractAddress?: EVMContractAddress,
): Promise<void> {
  console.log("coreConfig", coreConfig);
  if (window.ethereum) {
    const walletProvider = new WalletProvider();
    await walletProvider
      .connect()
      .andThen((accountAddress) => {
        console.log("walletProvider.signer", walletProvider.signer);
        coreConfig.iframeURL = "http://localhost:9010";
        coreConfig.primaryInfuraKey = "a8ae124ed6aa44bb97a7166cda30f1bc";
        const webIntegration = new SnickerdoodleWebIntegration(
          coreConfig,
          walletProvider.signer,
        );
        return webIntegration.initialize();
      })
      .andThen((dataWallet) => {
        console.log("Snickerdoodle Data Wallet Initialized");

        // If a consent contract was provided, we should pop up the invitation
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
      })
      .mapErr((e) => {
        console.error(e);
      });
  } else {
    const walletConnectIntegration = new WCProvider(
      coreConfig,
      consentContractAddress,
    );
    const webWallet_ = await walletConnectIntegration.connectToProvider();
  }
}
