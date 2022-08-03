import { Web3Provider } from "@ethersproject/providers";
import { IWalletProvider } from "@extension-onboarding/services/blockChainWalletProviders/interfaces";
import { Config } from "@extension-onboarding/services/blockChainWalletProviders/interfaces/objects";
import {
  ChainInformation,
  EVMAccountAddress,
  Signature,
} from "@snickerdoodlelabs/objects";
import WalletConnect from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import { ResultAsync, okAsync, errAsync } from "neverthrow";

export class WalletConnectProvider implements IWalletProvider {
  protected _web3Provider: Web3Provider | null = null;
  constructor(protected _config: Config) {}

  public get config(): Config {
    return this._config;
  }

  public get isInstalled(): boolean {
    return true;
  }
  public connect(): ResultAsync<EVMAccountAddress, unknown> {
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
      return okAsync(EVMAccountAddress(account));
    });
  }
  public getWeb3Signer(): ResultAsync<
    ethers.providers.JsonRpcSigner | undefined,
    never
  > {
    if (!this._web3Provider) {
      return okAsync(undefined);
    }
    return okAsync(this._web3Provider.getSigner());
  }
  public getWeb3Provider(): ResultAsync<Web3Provider | undefined, never> {
    if (!this._web3Provider) {
      return okAsync(undefined);
    }
    return okAsync(this._web3Provider);
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
  public checkAndSwitchToControlChain(): ResultAsync<ethers.providers.Web3Provider, unknown> {
    throw new Error("Method not implemented.");
  }
}
