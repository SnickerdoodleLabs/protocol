import "reflect-metadata";
import {
  EInvitationStatus,
  EVMContractAddress,
  IConfigOverrides,
  URLString,
} from "@snickerdoodlelabs/objects";
import { SnickerdoodleWebIntegration } from "@snickerdoodlelabs/web-integration";
import { okAsync } from "neverthrow";

import { WalletProvider } from "@static-web-integration/WalletProvider";

declare const __LOGO_PATH__: URLString;

export function integrateSnickerdoodle(
  coreConfig: IConfigOverrides,
  consentContract?: EVMContractAddress,
): void {
  // Create a floating div with the snickerdoodle logo
  const fixie = document.createElement("img");
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
  const walletProvider = new WalletProvider();

  await walletProvider
    .connect()
    .andThen((accountAddress) => {
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
}
