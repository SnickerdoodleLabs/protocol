import { IWalletProvider } from "@extension-onboarding/services/providers/interfaces";
import { ResultAsync, okAsync, errAsync } from "neverthrow";
import {
  EVMAccountAddress,
  ChainId,
  Signature,
  ChainInformation,
} from "@snickerdoodlelabs/objects";
import { PublicKey } from "@solana/web3.js";

type DisplayEncoding = "utf8" | "hex";

interface ConnectOpts {
  onlyIfTrusted: boolean;
}

interface PhantomProvider {
  publicKey: PublicKey | null;
  isConnected: boolean | null;
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
  get isInstalled(): boolean {
    console.log(this._provider);
    return !!this._provider;
  }
  connect(): ResultAsync<EVMAccountAddress, unknown> {
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
  getSignature(message: string): ResultAsync<Signature, unknown> {
    if (!this._provider) {
      return errAsync("Should call connect() first.");
    }
    const encodedMessage = new TextEncoder().encode(message);
    return ResultAsync.fromPromise(
      this._provider.signMessage(encodedMessage, "utf8"),
      (e) => errAsync(new Error("User cancelled")),
    ).andThen((signature) => {
      console.log(signature);
      // TODO decoded signature seems corrupted. research more about it.
      const decodedSignature = new TextDecoder().decode(signature.signature);
      return okAsync(Signature(decodedSignature));
    });
  }
  getChainInfo(): ResultAsync<ChainInformation, unknown> {
    throw Error("not implemented");
  }
}
