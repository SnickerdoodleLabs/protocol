import {
  JsonRpcSigner,
  JsonRpcProvider,
  FallbackProvider,
  Provider,
} from "@ethersproject/providers";
import {
  ChainId,
  BlockchainProviderError,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import {
  IBlockchainProvider,
  IConfigProvider,
  IConfigProviderType,
  ILogUtils,
  ILogUtilsType,
} from "@core/interfaces/utilities";
import { ResultUtils } from "neverthrow-result-utils";

@injectable()
export class BlockchainProvider implements IBlockchainProvider {
  protected providersResult: Map<ChainId, ResultAsync<Provider, never>> =
    new Map();

  protected defaultProvider: Provider | null = null;
  protected defaultSigner: JsonRpcSigner | null = null;

  public constructor(
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public initialize(): ResultAsync<void, never> {
    return this.configProvider.getConfig().andThen((config) => {
      for (const [
        chainId,
        chainInformation,
      ] of config.chainInformation.entries()) {
        const providers = chainInformation.providerUrls.map((providerUrl) => {
          return new JsonRpcProvider(providerUrl, chainId);
        });

        const fallbackProvider = new FallbackProvider(providers, chainId);
        this.providersResult.set(chainId, okAsync(fallbackProvider));
      }

      return okAsync(undefined);
    });
  }

  public getDefaultSigner(): ResultAsync<
    JsonRpcSigner,
    BlockchainProviderError | UninitializedError
  > {
    throw new Error("Method not implemented.");
  }

  public getDefaultProvider(): ResultAsync<Provider, never> {
    return this.configProvider.getConfig().andThen((config) => {
      const defaultProvider = this.providersResult.get(config.controlChainId);

      if (defaultProvider == null) {
        throw new Error("Must call BlockchainProvider.initialize() first.");
      }

      return defaultProvider;
    });
  }

  public getAllProviders(): ResultAsync<Map<ChainId, Provider>, never> {
    const providersMap: Map<ChainId, Provider> = new Map();

    return ResultUtils.combine(
      [...this.providersResult.values()].map((providerResult, index) => {
        return providerResult.andThen((provider) => {
          const chainIds = [...this.providersResult.keys()];
          providersMap.set(chainIds[index], provider);
          return okAsync(provider);
        });
      }),
    ).andThen(() => {
      return okAsync(providersMap);
    });
  }

  public getProvider(chainId?: ChainId): ResultAsync<Provider, never> {
    return this.configProvider.getConfig().andThen((config) => {
      const provider = this.providersResult.get(
        chainId || config.controlChainId,
      );

      if (provider == null) {
        throw new Error("Must call BlockchainProvider.initialize() first.");
      }

      return provider;
    });
  }
}
