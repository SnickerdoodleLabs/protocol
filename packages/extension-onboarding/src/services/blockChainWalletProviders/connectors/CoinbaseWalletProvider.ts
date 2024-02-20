/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AccountAddress, Signature } from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { ResultAsync, okAsync, errAsync } from "neverthrow";

import { IWalletProvider } from "@extension-onboarding/services/blockChainWalletProviders/interfaces";

export class CoinbaseWalletProvider implements IWalletProvider {
  protected _provider;
  protected _web3Provider: ethers.BrowserProvider | null = null;

  constructor() {
    this._provider = this.provider;
  }

  private get provider() {
    return (
      window?.ethereum?.providers?.find?.(
        (provider) => provider.isWalletLink,
      ) ??
      (window?.ethereum?.isWalletLink && window.ethereum)
    );
  }

  public get isInstalled(): boolean {
    return !!this._provider;
  }

  public connect(): ResultAsync<AccountAddress, unknown> {
    if (!this._provider) {
      return errAsync(new Error("Coinbase is not installed!"));
    }
    return ResultAsync.fromPromise(
      this._provider.request({
        method: "eth_requestAccounts",
        params: [{ eth_accounts: {} }],
      }) as Promise<unknown>,
      (e) => errAsync(new Error("User cancelled")),
    )
      .andThen(() => {
        return ResultAsync.fromPromise(
          this._provider.request({
            method: "eth_requestAccounts",
          }) as Promise<AccountAddress[]>,
          (e) => errAsync(new Error("User cancelled")),
        );
      })
      .andThen((accounts) => {
        const account = accounts?.[0];
        this._web3Provider = new ethers.BrowserProvider(this._provider);
        return okAsync(account as AccountAddress);
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
        return ResultAsync.fromPromise(signer.signMessage(message), (e) => {});
      })
      .map((signature) => {
        // below method can be used to disconnect but it requires reload
        // this._provider.close();
        return Signature(signature);
      });
  }
}

interface Provider {
  isWalletLink: boolean;
}
interface Ethereum {
  providers?: Provider[];
  isWalletLink: boolean;
}
declare const window: Window & {
  ethereum?: Ethereum;
};
