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
  protected _provider: Web3Provider | null = null;
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
    this._provider = new ethers.providers.Web3Provider(provider);
    return ResultAsync.fromPromise(provider.enable(), (e) =>
      console.log(e),
    ).andThen((accounts) => {
      const account = accounts[0];
      return okAsync(EVMAccountAddress(account));
    });
  }
  getChainInfo(): ResultAsync<ChainInformation, unknown> {
    throw new Error("");
  }
  getSignature(): ResultAsync<Signature, unknown> {
    if (!this._provider) {
      return errAsync("Should call connect() first.");
    }
    const signer = this._provider.getSigner();
    return ResultAsync.fromPromise(signer.signMessage("okan kalp fati"), (e) =>
      console.log(e),
    ).map((signature) => Signature(signature));
  }
}
