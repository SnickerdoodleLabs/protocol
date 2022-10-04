/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Web3Provider, JsonRpcSigner } from "@ethersproject/providers";
import { AccountAddress, Signature } from "@snickerdoodlelabs/objects";
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

  constructor() {
    // @ts-ignore
    this._provider = window?.solana?.isPhantom && window.solana;
  }

  public get isInstalled(): boolean {
    return !!this._provider;
  }
  public connect(): ResultAsync<AccountAddress, unknown> {
    if (!this._provider) {
      return errAsync(new Error("Phantom is not installed!"));
    }
    return ResultAsync.fromPromise(
      this._provider.connect() as Promise<{ publicKey: PublicKey }>,
      (e) => errAsync(new Error("User cancelled")),
    ).andThen((publicKey) => {
      const account = publicKey.publicKey.toBase58();
      return okAsync(account as AccountAddress);
    });
  }
  public getSignature(message: string): ResultAsync<Signature, unknown> {
    if (!this._provider) {
      return errAsync("Should call connect() first.");
    }
    const encodedMessage = new TextEncoder().encode(message);
    return ResultAsync.fromPromise(
      // @ts-ignore
      this._provider.signMessage(encodedMessage),
      (e) => errAsync(new Error("User cancelled")),
    ).andThen((signatureResult) => {
      return okAsync(Signature(signatureResult?.signature?.toString?.("hex")));
    });
  }
  public checkAndSwitchToControlChain(): ResultAsync<
    ethers.providers.Web3Provider,
    unknown
  > {
    throw new Error("Method not implemented.");
  }
}
