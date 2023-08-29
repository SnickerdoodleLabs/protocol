import { Web3Provider, ExternalProvider } from "@ethersproject/providers";
import EthereumProvider from "@walletconnect/ethereum-provider";
import { ethers } from "ethers";
import { ResultAsync, errAsync, okAsync } from "neverthrow";
export class WCProvider {
  protected ethereumProvider?: EthereumProvider;

  public init(projectId: string): ResultAsync<void, Error> {
    return ResultAsync.fromPromise(
      EthereumProvider.init({
        projectId,
        showQrModal: false,
        chains: [1],
      }),
      (e) => new Error(`User cancelled: ${(e as Error).message}`),
    )
      .andThen((provider) => {
        this.ethereumProvider = provider;
        if (this.ethereumProvider.accounts.length === 0) {
          return this.connectWithQR(projectId).andThen((provider_) => {
            this.ethereumProvider = provider_;
            return ResultAsync.fromPromise(
              this.ethereumProvider.connect(),
              (e) => new Error(`Failed to connect: ${(e as Error).message}`),
            );
          });
        }
        return okAsync(undefined);
      })
      .mapErr((e) => {
        console.log("WalletConnect Init Error", e);
        return new Error(`Initialization error: ${e.message}`);
      });
  }

  public getSigner(): ResultAsync<ethers.Signer, Error> {
    if (!this.ethereumProvider) {
      return errAsync(new Error("EthereumProvider is not initialized."));
    }

    const provider_ = new Web3Provider(
      this.ethereumProvider as ExternalProvider,
    );
    return okAsync(provider_.getSigner());
  }

  public connectWithQR(projectId: string) {
    return ResultAsync.fromPromise(
      EthereumProvider.init({
        projectId,
        showQrModal: true,
        chains: [1],
        methods: ["eth_sendTransaction", "personal_sign"],
      }),
      (e) => new Error(`User cancelled: ${(e as Error).message}`),
    ).mapErr((e) => {
      console.log("WalletConnect Init Error", e);
      return new Error(`Initialization error: ${e.message}`);
    });
  }

  public checkConnection(projectId: string): ResultAsync<boolean, never> {
    return ResultAsync.fromPromise(
      EthereumProvider.init({
        projectId,
        showQrModal: false,
        chains: [1],
      }),
      (e) => new Error(`User cancelled: ${(e as Error).message}`),
    )
      .map((provider) => {
        this.ethereumProvider = provider;
        if (this.ethereumProvider.accounts.length === 0) {
          return false;
        } else {
          return true;
        }
      })
      .orElse((e) => {
        console.log("WalletConnect Init Error", e);
        return okAsync(false);
      });
  }
}
