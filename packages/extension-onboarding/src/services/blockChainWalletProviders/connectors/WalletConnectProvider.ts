/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Web3Provider } from "@ethersproject/providers";
import { EVMAccountAddress, Signature } from "@snickerdoodlelabs/objects";
import WalletConnect from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import { ResultAsync, okAsync, errAsync } from "neverthrow";

import { IWalletProvider } from "@extension-onboarding/services/blockChainWalletProviders/interfaces";
import { Config } from "@extension-onboarding/services/blockChainWalletProviders/interfaces/objects";

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
  public checkAndSwitchToControlChain(): ResultAsync<
    ethers.providers.Web3Provider,
    unknown
  > {
    if (!this._web3Provider) {
      return errAsync("Should call connect() first.");
    }

    return ResultAsync.fromSafePromise(this._web3Provider.getNetwork())
      .andThen((network) => {
        if (network.chainId == this.config.controlChain.chainId) {
          return okAsync(undefined);
        } else {
          return ResultAsync.fromPromise(
            this._web3Provider!.send("wallet_addEthereumChain", [
              {
                chainId: `0x${this.config.controlChain.chainId.toString(16)}`,
                chainName: this.config.controlChain.name,
                rpcUrls: this.config.controlChain.providerUrls,
                nativeCurrency: {
                  name: this.config.controlChain.nativeCurrency.name,
                  decimals: this.config.controlChain.nativeCurrency.decimals,
                  symbol: this.config.controlChain.nativeCurrency.symbol,
                },
              },
            ]),
            (e) => e,
          ).map(() => {});
        }
      })
      .map(() => {
        return this._web3Provider!;
      });
  }
}
