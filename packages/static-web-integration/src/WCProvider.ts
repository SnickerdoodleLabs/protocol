import {
  EInvitationStatus,
  EVMContractAddress,
  IConfigOverrides,
} from "@snickerdoodlelabs/objects";
import { SnickerdoodleWebIntegration } from "@snickerdoodlelabs/web-integration";
import { EthereumProvider } from "@walletconnect/ethereum-provider";
import { ethers } from "ethers";
import { okAsync } from "neverthrow";

class WCProvider {
  private ethereumProvider: any;
  private coreConfig: IConfigOverrides;
  private consentContractAddress?: EVMContractAddress;
  constructor(
    coreConfig: IConfigOverrides,
    consentContractAddress?: EVMContractAddress,
  ) {
    this.coreConfig = coreConfig;
    this.consentContractAddress = consentContractAddress;
  }
  public async isPaired() {
    const pairing = await window.localStorage.getItem("wc@2:core:0.3//pairing");
    if (pairing) {
      const topicId = JSON.parse(pairing);
      this.ethereumProvider = await EthereumProvider.init({
        projectId: this.coreConfig.walletConnect!.projectId,
        showQrModal: false,
        chains: [1],
      });

      this.ethereumProvider.connect({
        pairingTopic: topicId[topicId.length - 1].topic,
      });
      const newSigner = new ethers.providers.Web3Provider(
        this.ethereumProvider,
      );
      const webIntegration = new SnickerdoodleWebIntegration(
        this.coreConfig,
        newSigner.getSigner(),
      );
      webIntegration
        .initialize()
        .andThen((dataWallet) => {
          console.log("Snickerdoodle Data Wallet Initialized");

          if (this.consentContractAddress != null) {
            return dataWallet
              .checkInvitationStatus(this.consentContractAddress)
              .andThen((invitationStatus) => {
                if (invitationStatus === EInvitationStatus.New) {
                  return dataWallet.acceptInvitation(
                    [],
                    this.consentContractAddress as EVMContractAddress,
                  );
                }
                return okAsync(undefined);
              });
          }

          return okAsync(undefined);
        })
        .mapErr((e) => {
          console.error(e);
        });

      return true;
    } else {
      return false;
    }
  }

  public async connectToProvider() {
    try {
      const isPaired = await this.isPaired();
      if (
        !this.ethereumProvider &&
        !isPaired &&
        this.coreConfig.walletConnect
      ) {
        const projectId = this.coreConfig.walletConnect.projectId;

        if (!projectId) {
          throw new Error("You need to provide PROJECT_ID");
        }

        this.ethereumProvider = await EthereumProvider.init({
          projectId,
          showQrModal: true,
          qrModalOptions: { themeMode: "light" },
          chains: [1],
          methods: ["eth_sendTransaction", "personal_sign"],
          events: ["chainChanged", "accountsChanged"],
          metadata: {
            name: this.coreConfig.walletConnect.metadata_name,
            description: this.coreConfig.walletConnect.metadata_description,
            url: this.coreConfig.walletConnect.metadata_url,
            icons: this.coreConfig.walletConnect.metadata_icons,
          },
        });

        this.ethereumProvider.on("connect", () => {
          const newSigner = new ethers.providers.Web3Provider(
            this.ethereumProvider,
          );
          const webIntegration = new SnickerdoodleWebIntegration(
            this.coreConfig,
            newSigner.getSigner(),
          );
          webIntegration
            .initialize()
            .andThen((dataWallet) => {
              console.log("Snickerdoodle Data Wallet Initialized");

              if (this.consentContractAddress != null) {
                return dataWallet
                  .checkInvitationStatus(this.consentContractAddress)
                  .andThen((invitationStatus) => {
                    if (invitationStatus === EInvitationStatus.New) {
                      return dataWallet.acceptInvitation(
                        [],
                        this.consentContractAddress as EVMContractAddress,
                      );
                    }
                    return okAsync(undefined);
                  });
              }

              return okAsync(undefined);
            })
            .mapErr((e) => {
              console.error(e);
            });
        });
        this.ethereumProvider.connect();
      }
    } catch (err) {
      console.error(err);
    }
  }
}

export default WCProvider;
