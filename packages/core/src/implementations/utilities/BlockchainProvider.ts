import {
  JsonRpcSigner,
  JsonRpcProvider,
  FallbackProvider,
} from "@ethersproject/providers";
import { ChainId, BlockchainProviderError } from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import {
  IBlockchainProvider,
  IConfigProvider,
  IConfigProviderType,
  ILogUtils,
  ILogUtilsType,
} from "@core/interfaces/utilities";
import { ethers } from "ethers";
import { ResultUtils } from "neverthrow-result-utils";

@injectable()
export class BlockchainProvider implements IBlockchainProvider {
  protected providers: Map<ChainId, JsonRpcProvider> = new Map();
  protected providersInitializationResult: ResultAsync<void, never> | null;

  protected controlProvider: JsonRpcProvider | null = null;
  protected controlSigner: JsonRpcSigner | null = null;

  public constructor(
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
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
          this.providers.set(
            chainId,
            new JsonRpcProvider(chainInformation.providerUrls[0], chainId),
          );
        }
      });

    return this.providersInitializationResult;
  }

  public getControlSigner(): ResultAsync<
    JsonRpcSigner,
    BlockchainProviderError
  > {
    throw new Error("Method not implemented.");
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
            `Couldn not find a provider for chainId ${config.controlChainId}`,
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
    chainId?: ChainId,
  ): ResultAsync<ethers.providers.Block, BlockchainProviderError> {
    return this.getProvider(chainId).map(async (provider) => {
      return await provider.getBlock("latest");
    });
  }

  protected waitForProvidersPromise(): ResultAsync<void, never> {
    if (this.providersInitializationResult == null) {
      throw new Error("Blockchain providers are not initialized yet");
    }

    return this.providersInitializationResult;
  }
}
