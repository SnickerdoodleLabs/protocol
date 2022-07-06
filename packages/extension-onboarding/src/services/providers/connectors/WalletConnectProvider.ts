import {
  ChainInformation,
  EVMAccountAddress,
  Signature,
} from "@snickerdoodlelabs/objects";
import { ResultAsync, okAsync, errAsync } from "neverthrow";
import { IWalletProvider } from "../interfaces";
import WalletConnect from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";

export class WalletConnectProvider implements IWalletProvider {
  protected _web3Provider: Web3Provider | null = null;

  get isInstalled(): boolean {
    return true;
  }
  connect(): ResultAsync<EVMAccountAddress, unknown> {
    let bridge = "https://bridge.walletconnect.org";
    let qrcode = true;
    let infuraId = "72827ccd538446f2a20e35a632664c52";
    let rpc = undefined;
    let chainId = 1;
    let qrcodeModalOptions = undefined;

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
      return okAsync(EVMAccountAddress(account));
    });
  }
  getChainInfo(): ResultAsync<ChainInformation, unknown> {
    throw new Error("");
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
}
