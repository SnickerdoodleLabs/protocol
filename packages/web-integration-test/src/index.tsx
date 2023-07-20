import "reflect-metadata";
import { Web3Provider, ExternalProvider } from "@ethersproject/providers";
import {
  AccountAddress,
  EChain,
  LanguageCode,
  Signature,
  URLString,
} from "@snickerdoodlelabs/objects";
import { SnickerdoodleWebIntegration } from "@snickerdoodlelabs/web-integration";
import { ethers } from "ethers";
import { ResultAsync, okAsync, errAsync } from "neverthrow";
import React from "react";
import ReactDOM from "react-dom";

export class WalletProvider {
  protected _web3Provider: Web3Provider | null = null;

  constructor() {}

  private get provider(): ExternalProvider | null {
    if (window.ethereum == null) {
      return null;
    }

    return window.ethereum;
  }

  public get isInstalled(): boolean {
    return !!this.provider;
  }

  public connect(): ResultAsync<AccountAddress, unknown> {
    if (!this.provider) {
      return errAsync(new Error("Metamask is not installed!"));
    }

    this._web3Provider = new ethers.providers.Web3Provider(this.provider);

    return ResultAsync.fromPromise(
      this._web3Provider.send("wallet_requestPermissions", [
        { eth_accounts: {} },
      ]) as Promise<unknown>,
      (e) => errAsync(new Error(`User cancelled: ${(e as Error).message}`)),
    )
      .andThen(() => {
        return ResultAsync.fromPromise(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this._web3Provider!.send("eth_requestAccounts", []) as Promise<
            AccountAddress[]
          >,
          (e) => errAsync(new Error("User cancelled")),
        );
      })
      .andThen((accounts) => {
        const account = accounts?.[0];

        return okAsync(account as AccountAddress);
      });
  }

  public getSignature(message: string): ResultAsync<Signature, unknown> {
    if (!this._web3Provider) {
      return errAsync("Should call connect() first.");
    }
    const signer = this._web3Provider.getSigner();
    return ResultAsync.fromPromise(signer.signMessage(message), (e) => {}).map(
      (signature) => Signature(signature),
    );
  }
}

// import App from "@extension-onboarding/App";

// ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);

const integration = new SnickerdoodleWebIntegration({
  primaryInfuraKey: "a8ae124ed6aa44bb97a7166cda30f1bc",
  iframeURL: URLString("http://localhost:9010"),
  debug: true,
});
const provider = new WalletProvider();

async function start() {
  console.log("Initializing Snickerdoodle Web Integration");
  await integration
    .initialize()
    .andThen(() => {
      console.log("Connecting to Metamask");
      return provider.connect();
    })
    .andThen((accountAddress) => {
      // Check if the integration is already unlocked or not
      return integration.core.metrics.getUnlocked().andThen((unlocked) => {
        if (unlocked) {
          // No need to do anything!
          console.log("Snickerdoodle core was automatically unlocked!");
          return integration.core.getAccounts().andThen((linkedAccounts) => {
            // Check if the account that is linked to the page is linked to the data wallet
            const existingAccount = linkedAccounts.find((linkedAccount) => {
              return linkedAccount.sourceAccountAddress == accountAddress;
            });

            // Account is already linked, no need to do anything
            if (existingAccount != null) {
              return okAsync(undefined);
            }

            // No account linked, need to connect it
            return integration.core
              .getUnlockMessage()
              .andThen((unlockMessage) => {
                return provider.getSignature(unlockMessage);
              })
              .andThen((signature) => {
                return integration.core.addAccount(
                  accountAddress,
                  signature,
                  EChain.EthereumMainnet,
                  LanguageCode("en"),
                );
              });
          });
        }

        // Integration is not unlocked
        return integration.core
          .getUnlockMessage()
          .andThen((unlockMessage) => {
            return provider.getSignature(unlockMessage);
          })
          .andThen((signature) => {
            return integration.core.unlock(
              accountAddress,
              signature,
              EChain.EthereumMainnet,
              LanguageCode("en"),
            );
          });
      });
    })
    .map(() => {
      console.log("Unlocked core!");
    })
    .mapErr((e) => {
      console.error(e);
    });
}

start();
