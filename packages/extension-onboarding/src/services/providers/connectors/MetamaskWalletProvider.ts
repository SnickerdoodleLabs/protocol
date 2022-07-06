import { IWalletProvider } from "@extension-onboarding/services/providers/interfaces";
import { ResultAsync, okAsync, errAsync } from "neverthrow";
import {
  EVMAccountAddress,
  ChainId,
  Signature,
  ChainInformation,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
export class MetamaskWalletProvider implements IWalletProvider {
  protected _provider;
  connect(): ResultAsync<EVMAccountAddress, unknown> {
    const provider = // @ts-ignore
      window?.ethereum?.providers?.find?.((provider) => provider.isMetaMask) ??
      // @ts-ignore
      (window?.ethereum?.isMetaMask && window.ethereum);
    if (!provider) {
      return errAsync(new Error("Metamask is not installed!"));
    }
    this._provider = new ethers.providers.Web3Provider(provider);
    return ResultAsync.fromPromise(
      provider.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      }) as Promise<unknown>,
      (e) => errAsync(new Error("User cancelled")),
    )
      .andThen(() => {
        return ResultAsync.fromPromise(
          provider.request({
            method: "eth_requestAccounts",
          }) as Promise<EVMAccountAddress[]>,
          (e) => errAsync(new Error("User cancelled")),
        );
      })
      .andThen((accounts) => {
        const account = accounts?.[0];
        return okAsync(EVMAccountAddress(account));
      });
  }
  getSignature(): ResultAsync<Signature, unknown> {
    return okAsync(Signature("123"));
  }
  getChainInfo(): ResultAsync<ChainInformation, unknown> {
    throw Error("not implemented");
  }
}
