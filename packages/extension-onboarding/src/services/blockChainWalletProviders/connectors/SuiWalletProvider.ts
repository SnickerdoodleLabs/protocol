/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Web3Provider, JsonRpcSigner } from "@ethersproject/providers";
import {
  AccountAddress,
  EVMAccountAddress,
  Signature,
  SuiAccountAddress,
} from "@snickerdoodlelabs/objects";
import { PublicKey } from "@solana/web3.js";
import { ethers } from "ethers";
import { ResultAsync, okAsync, errAsync } from "neverthrow";

import { IWalletProvider } from "@extension-onboarding/services/blockChainWalletProviders/interfaces";
import { Config } from "@extension-onboarding/services/blockChainWalletProviders/interfaces/objects";

enum DisplayEncoding {
  utf8 = "utf8",
  hex = "hex",
}

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

export class SuiWalletProvider implements IWalletProvider {
  protected _provider: PhantomProvider | null;

  constructor() {
    // this._provider = window?.solana?.isPhantom && window.solana;
    // this._provider = window?.sui?.isSuiWallet && window.sui;
    // this._provider = SuiProvider();
    // console.log("Sui provider: " + this._provider);
    this._provider = null;
  }

  public get isInstalled(): boolean {
    return !!this._provider;
  }
  public connect(): ResultAsync<AccountAddress, unknown> {
    console.log("Sui Connect 1!");
    // return okAsync(EVMAccountAddress(""));

    if (!this._provider) {
      return errAsync(new Error("Sui Wallet is not installed!"));
    }
    return ResultAsync.fromPromise(
      this._provider.connect() as Promise<{ publicKey: PublicKey }>,
      (e) => errAsync(new Error("User cancelled")),
    ).andThen((publicKey) => {
      console.log("Sui Connect 2!");

      //   const account = publicKey.publicKey.toBase58();
      const account = publicKey.publicKey.toString();
      return okAsync(account as AccountAddress);
    });
  }
  public getSignature(message: string): ResultAsync<Signature, unknown> {
    // TODO
    return okAsync(Signature(""));

    // if (!this._provider) {
    //   return errAsync("Should call connect() first.");
    // }
    // const encodedMessage = new TextEncoder().encode(message);
    // return ResultAsync.fromPromise(
    //   // @ts-ignore
    //   this._provider.signMessage(encodedMessage),
    //   (e) => errAsync(new Error("User cancelled")),
    // ).andThen((signatureResult) => {
    //   console.log("Sui Connect 4!");

    //   return okAsync(Signature(signatureResult?.signature?.toString?.("hex")));
    // });
  }
  public checkAndSwitchToControlChain(): ResultAsync<
    ethers.providers.Web3Provider,
    unknown
  > {
    throw new Error("Method not implemented.");
  }
}
