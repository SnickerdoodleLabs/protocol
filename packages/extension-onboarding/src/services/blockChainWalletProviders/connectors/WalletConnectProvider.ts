/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Web3Provider } from "@ethersproject/providers";
import { IWalletProvider } from "@extension-onboarding/services/blockChainWalletProviders/interfaces";
import { AccountAddress, Signature } from "@snickerdoodlelabs/objects";
import WalletConnect from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import { ResultAsync, okAsync, errAsync } from "neverthrow";

export class WalletConnectProvider implements IWalletProvider {
  protected _web3Provider: Web3Provider | null = null;
  constructor() {}

  public get isInstalled(): boolean {
    return true;
  }
  public connect(): ResultAsync<AccountAddress, unknown> {
    localStorage.removeItem("walletconnect");
    const bridge = "https://bridge.walletconnect.org";
    const qrcode = true;
    const infuraId = "72827ccd538446f2a20e35a632664c52";
    const rpc = undefined;
    const chainId = 1;
    const qrcodeModalOptions = undefined;

    const provider = new WalletConnect({
      bridge,
      qrcode,
      infuraId,
      rpc,
      chainId,
      qrcodeModalOptions,
    });
    return ResultAsync.fromPromise(provider.enable(), (e) =>
      console.log(e),
    ).andThen((accounts) => {
      this._web3Provider = new ethers.providers.Web3Provider(provider);
      const account = accounts[0];
      return okAsync(account as AccountAddress);
    });
  }

  public getSignature(message: string): ResultAsync<Signature, unknown> {
    if (!this._web3Provider) {
      return errAsync("Should call connect() first.");
    }
    const signer = this._web3Provider.getSigner();
    return ResultAsync.fromPromise(
      signer.signMessage(new TextEncoder().encode(message)),
      (e) => console.log(e),
    ).map((signature) => Signature(signature));
  }
}
