/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { IWalletProvider } from "@extension-onboarding/services/blockChainWalletProviders/interfaces";
import { AccountAddress, Signature } from "@snickerdoodlelabs/objects";
import { ResultAsync, okAsync, errAsync } from "neverthrow";

export class MetamaskWalletProvider implements IWalletProvider {
  protected _provider;
  // protected _web3Provider: ethers.BrowserProvider | null = null;

  constructor() {
    this._provider = this.provider;
  }

  private get provider() {
    return (
      window?.ethereum?.providers?.find?.((provider) => provider.isMetaMask) ??
      (window?.ethereum?.isMetaMask ? window.ethereum : null)
    );
  }

  public get isInstalled(): boolean {
    return !!this._provider;
  }

  public connect(): ResultAsync<AccountAddress, unknown> {
    if (!this._provider) {
      return errAsync(new Error("Metamask is not installed!"));
    }

    return ResultAsync.fromPromise(
      this._provider.request({
        method: "wallet_requestPermissions",
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
        return okAsync(account as AccountAddress);
      });
  }

  public getSignature(message: string): ResultAsync<Signature, unknown> {
    if (!this._provider) {
      return errAsync("Should call connect() first.");
    }

    return ResultAsync.fromPromise(
      this._provider.request({
        method: "eth_requestAccounts",
      }) as Promise<AccountAddress[]>,
      (e) => errAsync(new Error("User cancelled")),
    )
      .andThen((accounts) => {
        const account = accounts?.[0];
        return ResultAsync.fromPromise(
          this._provider.request({
            method: "personal_sign",
            params: [message, account],
          }) as Promise<string>,
          (e) => errAsync(new Error("Signing failed")),
        );
      })
      .map((signature) => Signature(signature));
  }
}

interface Provider {
  isMetaMask: boolean;
}
interface Ethereum {
  providers?: Provider[];
  isMetaMask: boolean;
}
declare const window: Window & {
  ethereum?: Ethereum;
};
