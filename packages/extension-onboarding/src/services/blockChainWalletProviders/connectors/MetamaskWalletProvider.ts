/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Web3Provider } from "@ethersproject/providers";
import {
  EVMAccountAddress,
  ChainId,
  Signature,
  ChainInformation,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { ResultAsync, okAsync, errAsync } from "neverthrow";

import { IWalletProvider } from "@extension-onboarding/services/blockChainWalletProviders/interfaces";

export class MetamaskWalletProvider implements IWalletProvider {
  protected _provider;
  protected _web3Provider: Web3Provider | null = null;

  constructor() {
    this._provider = // @ts-ignore
      window?.ethereum?.providers?.find?.((provider) => provider.isMetaMask) ??
      // @ts-ignore
      (window?.ethereum?.isMetaMask && window.ethereum);
  }
  get isInstalled(): boolean {
    return !!this._provider;
  }
  connect(): ResultAsync<EVMAccountAddress, unknown> {
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
          }) as Promise<EVMAccountAddress[]>,
          (e) => errAsync(new Error("User cancelled")),
        );
      })
      .andThen((accounts) => {
        const account = accounts?.[0];
        this._web3Provider = new ethers.providers.Web3Provider(this._provider);
        return okAsync(EVMAccountAddress(account));
      });
  }
  getSignature(message: string): ResultAsync<Signature, unknown> {
    if (!this._web3Provider) {
      return errAsync("Should call connect() first.");
    }
    const signer = this._web3Provider.getSigner();
    return ResultAsync.fromPromise(signer.signMessage(message), (e) =>
      console.log(e),
    ).map((signature) => Signature(signature));
  }
  getChainInfo(): ResultAsync<ChainInformation, unknown> {
    throw Error("not implemented");
  }
}
