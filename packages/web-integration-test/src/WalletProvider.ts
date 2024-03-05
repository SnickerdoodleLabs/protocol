import { AccountAddress, Signature } from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { ResultAsync, errAsync } from "neverthrow";

export class WalletProvider {
  protected _web3Provider: ethers.BrowserProvider | null = null;

  public get isInstalled(): boolean {
    return !!this.provider;
  }

  public get provider(): ethers.BrowserProvider {
    if (!this._web3Provider) {
      throw new Error("Should call connect() first.");
    }
    return this._web3Provider.provider;
  }

  public getSigner(): ResultAsync<ethers.Signer, unknown> {
    if (!this._web3Provider) {
      throw new Error("Should call connect() first.");
    }
    return ResultAsync.fromPromise(this._web3Provider.getSigner(), (e) => {
      return e;
    });
  }

  public connect(): ResultAsync<AccountAddress, unknown> {
    if (!this.sourceProvider) {
      return errAsync(new Error("Metamask is not installed!"));
    }

    this._web3Provider = new ethers.BrowserProvider(this.sourceProvider);

    return ResultAsync.fromPromise(
      this._web3Provider.send("wallet_requestPermissions", [
        { eth_accounts: {} },
      ]) as Promise<unknown>,
      (e) => new Error(`User cancelled: ${(e as Error).message}`),
    )
      .andThen(() => {
        return ResultAsync.fromPromise(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this._web3Provider!.send("eth_requestAccounts", []) as Promise<
            AccountAddress[]
          >,
          (e) => new Error("User cancelled"),
        );
      })
      .map((accounts) => {
        const account = accounts?.[0];

        return account;
      });
  }

  public getSignature(message: string): ResultAsync<Signature, unknown> {
    if (!this._web3Provider) {
      return errAsync("Should call connect() first.");
    }
    return ResultAsync.fromPromise(this._web3Provider.getSigner(), (e) => {
      return e;
    })
      .andThen((signer) => {
        return ResultAsync.fromPromise(signer.signMessage(message), (e) => {
          return e;
        });
      })
      .map((signature) => Signature(signature));
  }

  private get sourceProvider(): ethers.Eip1193Provider | null {
    if (window.ethereum == null) {
      return null;
    }

    return window.ethereum;
  }
}
