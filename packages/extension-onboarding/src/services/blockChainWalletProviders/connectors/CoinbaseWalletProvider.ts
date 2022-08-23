/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Web3Provider } from "@ethersproject/providers";
import { EVMAccountAddress, Signature } from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { ResultAsync, okAsync, errAsync } from "neverthrow";

import { IWalletProvider } from "@extension-onboarding/services/blockChainWalletProviders/interfaces";
import { Config } from "@extension-onboarding/services/blockChainWalletProviders/interfaces/objects";

export class CoinbaseWalletProvider implements IWalletProvider {
  protected _provider;
  protected _web3Provider: Web3Provider | null = null;

  constructor(protected _config: Config) {
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

  private updateProvider() {
    this._provider = this.provider;
    this._web3Provider = new ethers.providers.Web3Provider(this._provider);
  }

  public get config() {
    return this._config;
  }
  public get isInstalled(): boolean {
    return !!this._provider;
  }

  public connect(): ResultAsync<EVMAccountAddress, unknown> {
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

  public getWeb3Provider(): ResultAsync<Web3Provider | undefined, never> {
    if (!this._web3Provider) {
      return okAsync(undefined);
    }
    return okAsync(this._web3Provider);
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
          ).map(() => {
            this.updateProvider();
          });
        }
      })
      .map(() => {
        return this._web3Provider!;
      });
  }

  public getSignature(message: string): ResultAsync<Signature, unknown> {
    if (!this._web3Provider) {
      return errAsync("Should call connect() first.");
    }
    const signer = this._web3Provider.getSigner();
    return ResultAsync.fromPromise(signer.signMessage(message), (e) =>
      console.log(e),
    ).map((signature) => {
      // below method can be used to disconnect but it requires reload
      // this._provider.close();
      return Signature(signature);
    });
  }
}
