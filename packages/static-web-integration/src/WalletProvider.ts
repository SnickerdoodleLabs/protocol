import { Web3Provider, ExternalProvider } from "@ethersproject/providers";
import { AccountAddress, Signature } from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { ResultAsync, errAsync, okAsync } from "neverthrow";

export class WalletProvider {
  protected _web3Provider: Web3Provider | null = null;

  public get isInstalled(): boolean {
    return !!this.provider;
  }

  public get provider(): ExternalProvider {
    if (!this._web3Provider) {
      throw new Error("Should call connect() first.");
    }
    return this._web3Provider.provider;
  }

  public get signer(): ethers.Signer {
    if (!this._web3Provider) {
      throw new Error("Should call connect() first.");
    }
    return this._web3Provider.getSigner();
  }

  public connect(): ResultAsync<AccountAddress, Error> {
    if (!this.sourceProvider) {
      return errAsync(new Error("Metamask is not installed!"));
    }

    this._web3Provider = new ethers.providers.Web3Provider(this.sourceProvider);

    return ResultAsync.fromPromise(
      this._web3Provider.listAccounts() as Promise<AccountAddress[]>,
      (e) => {
        return e as Error;
      },
    ).andThen((accounts) => {
      if (accounts.length === 0) {
        return ResultAsync.fromPromise(
          this._web3Provider!.send("wallet_requestPermissions", [
            { eth_accounts: {} },
          ]) as Promise<unknown>,
          (e) => {
            console.error(e);
            return new Error("Connection request was cancelled by the user.");
          },
        )
          .andThen(() => {
            return ResultAsync.fromPromise(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              this._web3Provider!.send("eth_requestAccounts", []) as Promise<
                AccountAddress[]
              >,
              (e) => {
                return new Error(
                  "Connection request was cancelled by the user.",
                );
              },
            );
          })
          .map((accounts) => {
            const account = accounts?.[0];

            return account;
          });
      }
      return ResultAsync.fromPromise(
        Promise.resolve(accounts[0]),
        (e) =>
          new Error(
            "An unexpected error occurred while attempting to establish a connection.",
          ),
      );
    });
  }

  public checkConnection(): ResultAsync<boolean, Error> {
    if (!this.sourceProvider) {
      return okAsync(false);
    } else {
      this._web3Provider = new ethers.providers.Web3Provider(
        this.sourceProvider,
      );
      return ResultAsync.fromPromise(this._web3Provider.listAccounts(), (e) => {
        return new Error(
          "An unexpected error occurred while checking the connection status.",
        );
      }).map((accounts) => {
        return accounts.length > 0;
      });
    }
  }

  public getSignature(message: string): ResultAsync<Signature, Error> {
    if (!this._web3Provider) {
      return errAsync(new Error("Should call connect() first."));
    }
    const signer = this._web3Provider.getSigner();
    return ResultAsync.fromPromise(signer.signMessage(message), (e) => {
      return e as Error;
    }).map((signature) => {
      return Signature(signature);
    });
  }

  private get sourceProvider(): ExternalProvider | null {
    if (window.ethereum == null) {
      return null;
    }

    return window.ethereum;
  }
}

declare global {
  interface Window {
    ethereum?: ExternalProvider;
    sui?: ExternalProvider;
  }
}
