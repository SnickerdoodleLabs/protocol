/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Web3Provider, JsonRpcSigner } from "@ethersproject/providers";
import {
  EVMAccountAddress,
  ChainId,
  Signature,
  ChainInformation,
} from "@snickerdoodlelabs/objects";
import { PublicKey } from "@solana/web3.js";
import { ethers } from "ethers";
import { ResultAsync, okAsync, errAsync } from "neverthrow";

import { IWalletProvider } from "@extension-onboarding/services/blockChainWalletProviders/interfaces";
import { Config } from "@extension-onboarding/services/blockChainWalletProviders/interfaces/objects";

type DisplayEncoding = "utf8" | "hex";

interface ConnectOpts {
  onlyIfTrusted: boolean;
}
type PhantomRequestMethod =
  | "connect"
  | "disconnect"
  | "signAndSendTransaction"
  | "signTransaction"
  | "signAllTransactions"
  | "signMessage";

interface PhantomProvider {
  publicKey: PublicKey | null;
  isConnected: boolean | null;
  request: (method: PhantomRequestMethod, params: any) => Promise<unknown>;
  connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
  signMessage: (
    message: Uint8Array | string,
    display?: DisplayEncoding,
  ) => Promise<any>;
}

export class PhantomWalletProvider implements IWalletProvider {
  protected _provider: PhantomProvider | null;

  constructor(protected _config: Config) {
    // @ts-ignore
    this._provider = window?.solana?.isPhantom && window.solana;
  }
  public getWeb3Provider(): ResultAsync<Web3Provider | undefined, never> {
    throw new Error("Method not implemented.");
  }
  public getWeb3Signer(): ResultAsync<JsonRpcSigner | undefined, never> {
    throw new Error("Method not implemented.");
  }
  public get config(): Config {
    return this._config;
  }
  public get isInstalled(): boolean {
    return !!this._provider;
  }
  public connect(): ResultAsync<EVMAccountAddress, unknown> {
    if (!this._provider) {
      return errAsync(new Error("Phantom is not installed!"));
    }
    return ResultAsync.fromPromise(
      this._provider.connect() as Promise<{ publicKey: PublicKey }>,
      (e) => errAsync(new Error("User cancelled")),
    ).andThen((publicKey) => {
      const account = publicKey.publicKey.toBase58();
      return okAsync(EVMAccountAddress(account));
    });
  }
  public getSignature(message: string): ResultAsync<Signature, unknown> {
    if (!this._provider) {
      return errAsync("Should call connect() first.");
    }
    const encodedMessage = new TextEncoder().encode(message);
    return ResultAsync.fromPromise(
      // @ts-ignore
      this._provider.request({
        method: "signMessage",
        params: {
          message: encodedMessage,
          display: "utf8",
        },
      }) as Promise<{ publicKey: EVMAccountAddress; signature: Signature }>,
      (e) => errAsync(new Error("User cancelled")),
    ).andThen((signatureResult) => {
      return okAsync(Signature(signatureResult.signature));
    });
  }
  public checkAndSwitchToControlChain(): ResultAsync<
    ethers.providers.Web3Provider,
    unknown
  > {
    throw new Error("Method not implemented.");
  }
}
