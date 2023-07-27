/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Web3Provider, ExternalProvider } from "@ethersproject/providers";
import {
  AccountAddress,
  ChainId,
  EChain,
  Signature,
  getChainInfoByChainId,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";
import { ResultAsync, errAsync, okAsync } from "neverthrow";

import { IBlockchainProviderRepository } from "@core-iframe/interfaces/data/index";

@injectable()
export class BlockchainProviderRepository
  implements IBlockchainProviderRepository
{
  protected _web3Provider: Web3Provider | null = null;
  protected connectResult: ResultAsync<AccountAddress, Error> | null = null;
  protected lastAccount: AccountAddress | null = null;
  protected lastChain: EChain | null = null;

  constructor() {}

  public connect(): ResultAsync<AccountAddress, Error> {
    if (!this.provider) {
      return errAsync(new Error("Metamask is not installed!"));
    }

    if (this.connectResult == null) {
      this._web3Provider = new ethers.providers.Web3Provider(this.provider);

      this.connectResult = ResultAsync.fromPromise(
        this._web3Provider.send("wallet_requestPermissions", [
          { eth_accounts: {} },
        ]) as Promise<unknown>,
        (e) => {
          return new Error(`User cancelled: ${(e as Error).message}`);
        },
      )
        .andThen(() => {
          return ResultAsync.fromPromise(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this._web3Provider!.send("eth_requestAccounts", []) as Promise<
              AccountAddress[]
            >,
            (e) => new Error("User cancelled"),
          );
        })
        .andThen((accounts) => {
          this.lastAccount = accounts[0];

          return this.getChain();
        })
        .map(() => {
          return this.lastAccount!;
        });
    }

    return this.connectResult;
  }

  public getSignature(message: string): ResultAsync<Signature, Error> {
    if (!this._web3Provider) {
      return errAsync(new Error("Should call connect() first."));
    }
    const signer = this._web3Provider.getSigner();
    return ResultAsync.fromPromise(signer.signMessage(message), (e) => {
      return new Error(
        `Error while getting signature: ${(e as Error).message}`,
      );
    }).map((signature) => Signature(signature));
  }

  public requestPermissionChange(): ResultAsync<AccountAddress, Error> {
    // Should always call connect first; this method is actually the same right now
    // except it doesn't create the web3Provider.
    if (this.connectResult == null || this._web3Provider == null) {
      return this.connect();
    }

    return ResultAsync.fromPromise(
      this._web3Provider.send("wallet_requestPermissions", [
        { eth_accounts: {} },
      ]) as Promise<unknown>,
      (e) => {
        return new Error(`User cancelled: ${(e as Error).message}`);
      },
    )
      .andThen(() => {
        return ResultAsync.fromPromise(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this._web3Provider!.send("eth_requestAccounts", []) as Promise<
            AccountAddress[]
          >,
          (e) => new Error("User cancelled"),
        );
      })
      .andThen((accounts) => {
        this.lastAccount = accounts[0];

        return this.getChain();
      })
      .map(() => {
        return this.lastAccount!;
      });
  }

  public getCurrentAccount(): ResultAsync<AccountAddress, Error> {
    // If we have a last account, then just return that
    if (this.lastAccount != null) {
      return okAsync(this.lastAccount);
    }

    // If not, we must not even be connected (or are in the process)
    return this.connect();
  }

  public getCurrentChain(): ResultAsync<EChain, Error> {
    if (this.lastChain != null) {
      return okAsync(this.lastChain);
    }

    // If not, we must not even be connected (or are in the process)
    return this.connect().map(() => {
      return this.lastChain!;
    });
  }

  private getChain(): ResultAsync<EChain, Error> {
    if (this._web3Provider == null) {
      return errAsync(
        new Error("Cannot get netork, have not setup the web3Provider"),
      );
    }
    return ResultAsync.fromPromise(this._web3Provider.getNetwork(), (e) => {
      return e as Error;
    }).map((network) => {
      const chainInfo = getChainInfoByChainId(ChainId(network.chainId));
      this.lastChain = chainInfo.chain;
      return chainInfo.chain;
    });
  }

  private get provider(): ExternalProvider | null {
    if (window.ethereum == null) {
      return null;
    }

    return window.ethereum;
  }
}
