/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { JsonRpcSigner, JsonRpcProvider } from "@ethersproject/providers";
import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import {
  ChainId,
  BlockchainProviderError,
  EChain,
} from "@snickerdoodlelabs/objects";
import { ethers, Wallet } from "ethers";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import {
  IBlockchainProvider,
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities/index.js";

@injectable()
export class BlockchainProvider implements IBlockchainProvider {
  protected providerInitializationResult: ResultAsync<void, never> | null;

  protected primaryProvider: JsonRpcProvider | null = null;
  protected secondaryProvider: JsonRpcProvider | null = null;
  protected primarySigner: JsonRpcSigner | null = null;

  public constructor(
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {
    this.providerInitializationResult = null;
  }

  public initialize(): ResultAsync<void, never> {
    // Prevent initialize() from being called twice
    if (this.providerInitializationResult != null) {
      return this.providerInitializationResult;
    }

    this.providerInitializationResult = this.configProvider
      .getConfig()
      .map((config) => {
        this.primaryProvider = new ethers.providers.JsonRpcProvider(
          config.controlChainId === EChain.DevDoodle
            ? config.devChainProviderURL
            : `https://${config.controlChainInformation.networkName}.infura.io/v3/${config.primaryInfuraKey}`,
        );

        // The secondary is optional, and depends on the config. We only have backups for non-devchains

        if (config.controlChainId != EChain.DevDoodle) {
          if (config.backupInfuraKey != null) {
            this.secondaryProvider = new ethers.providers.JsonRpcProvider(
              `https://${config.controlChainInformation.networkName}.infura.io/v3/${config.backupInfuraKey}`,
            );
          } else if (config.alchemyKey != null) {
            // TODO: update URL for alchemy when internet comes back on. We also have to make sure
            // the control chain is supported by alchemy
            this.secondaryProvider = new ethers.providers.JsonRpcProvider(
              `https://${config.controlChainInformation.networkName}.infura.io/v3/${config.alchemyKey}`,
            );
          }
        }
      });

    return this.providerInitializationResult;
  }

  public getPrimarySigner(): ResultAsync<Wallet, BlockchainProviderError> {
    this.logUtils.warning(
      "Requesting a primary signer. This is probably unintentional; we can only sign with the data wallet key which should not have any funds and should not be signing anything directly anyway",
    );
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.getPrimaryProvider(),
    ]).map(([context, provider]) => {
      return new Wallet(context.dataWalletKey!, provider);
    });
  }

  public getPrimaryProvider(): ResultAsync<
    JsonRpcProvider,
    BlockchainProviderError
  > {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.waitForProviderPromise(),
    ]).andThen(([config]) => {
      if (this.primaryProvider == null) {
        return errAsync(
          new BlockchainProviderError(
            config.controlChainId,
            `Could not find primary provider for chainId ${config.controlChainId}`,
          ),
        );
      }

      return okAsync(this.primaryProvider);
    });
  }

  public getSecondaryProvider(): ResultAsync<
    JsonRpcProvider | null,
    BlockchainProviderError
  > {
    return this.waitForProviderPromise().map(() => {
      return this.secondaryProvider;
    });
  }

  public getLatestBlock(
    chainId: ChainId,
  ): ResultAsync<ethers.providers.Block, BlockchainProviderError> {
    return this.getPrimaryProvider().andThen((provider) => {
      return ResultAsync.fromPromise(provider.getBlock("latest"), (e) => {
        return new BlockchainProviderError(
          chainId,
          "Cannot retrieve latest block",
          e,
        );
      });
    });
  }

  protected waitForProviderPromise(): ResultAsync<void, never> {
    if (this.providerInitializationResult == null) {
      throw new Error("Blockchain providers are not initialized yet");
    }

    return this.providerInitializationResult;
  }
}
