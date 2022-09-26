/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  JsonRpcSigner,
  JsonRpcProvider,
  FallbackProvider,
} from "@ethersproject/providers";
import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import { ChainId, BlockchainProviderError } from "@snickerdoodlelabs/objects";
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
  protected providers: Map<ChainId, JsonRpcProvider> = new Map();
  protected providersInitializationResult: ResultAsync<void, never> | null;

  protected controlProvider: JsonRpcProvider | null = null;
  protected controlSigner: JsonRpcSigner | null = null;

  public constructor(
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {
    this.providersInitializationResult = null;
  }

  public initialize(): ResultAsync<void, never> {
    // Prevent initialize() from being called twice
    if (this.providersInitializationResult != null) {
      return this.providersInitializationResult;
    }

    this.providersInitializationResult = this.configProvider
      .getConfig()
      .map((config) => {
        for (const [
          chainId,
          chainInformation,
        ] of config.chainInformation.entries()) {
          /* const providers = chainInformation.providerUrls.map((providerUrl) => {
          return new JsonRpcProvider(providerUrl, chainId);
        });

        const fallbackProvider = new FallbackProvider(providers, chainId); */
          this.logUtils.debug(
            `Initializing provider for chain ${chainId}, url ${chainInformation.providerUrls}`,
          );
          this.providers.set(
            chainId,
            new JsonRpcProvider(chainInformation.providerUrls[0], chainId),
          );
        }
      });

    return this.providersInitializationResult;
  }

  public getControlSigner(): ResultAsync<Wallet, BlockchainProviderError> {
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.getControlProvider(),
    ]).map(([context, provider]) => {
      return new Wallet(context.dataWalletKey!, provider);
    });
  }

  public getControlProvider(): ResultAsync<
    JsonRpcProvider,
    BlockchainProviderError
  > {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.waitForProvidersPromise(),
    ]).andThen(([config]) => {
      const controlProvider = this.providers.get(config.controlChainId);

      if (controlProvider == null) {
        return errAsync(
          new BlockchainProviderError(
            config.controlChainId,
            `Could not find a provider for chainId ${config.controlChainId}`,
          ),
        );
      }

      return okAsync(controlProvider);
    });
  }

  public getAllProviders(): ResultAsync<Map<ChainId, JsonRpcProvider>, never> {
    return this.waitForProvidersPromise().map(() => {
      return this.providers;
    });
  }

  public getProvider(
    chainId?: ChainId,
  ): ResultAsync<JsonRpcProvider, BlockchainProviderError> {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.waitForProvidersPromise(),
    ]).andThen(([config]) => {
      const requestedChainId = chainId || config.controlChainId;
      const provider = this.providers.get(requestedChainId);

      if (provider == null) {
        return errAsync(
          new BlockchainProviderError(
            requestedChainId,
            `Couldn not find a provider for chainId ${requestedChainId}`,
          ),
        );
      }

      return okAsync(provider);
    });
  }

  public getLatestBlock(
    chainId: ChainId,
  ): ResultAsync<ethers.providers.Block, BlockchainProviderError> {
    return this.getProvider(chainId).andThen((provider) => {
      return ResultAsync.fromPromise(provider.getBlock("latest"), (e) => {
        return new BlockchainProviderError(
          chainId,
          "Cannot retrieve latest block",
          e,
        );
      });
    });
  }

  protected waitForProvidersPromise(): ResultAsync<void, never> {
    if (this.providersInitializationResult == null) {
      throw new Error("Blockchain providers are not initialized yet");
    }

    return this.providersInitializationResult;
  }
}
