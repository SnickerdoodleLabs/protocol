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
      });

    return this.providerInitializationResult;
  }

  public getPrimarySigner(): ResultAsync<Wallet, BlockchainProviderError> {
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
