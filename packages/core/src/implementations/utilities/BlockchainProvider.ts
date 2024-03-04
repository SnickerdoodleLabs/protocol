/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import {
  ChainId,
  BlockchainProviderError,
  EChain,
  EComponentStatus,
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

  protected primaryProvider: ethers.JsonRpcProvider | null = null;
  protected secondaryProvider: ethers.JsonRpcProvider | null = null;
  protected primarySigner: ethers.JsonRpcSigner | null = null;

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

    this.providerInitializationResult = ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
    ]).map(([config, context]) => {
      if (config.controlChainId === EChain.DevDoodle) {
        if (config.devChainProviderURL == null) {
          throw new Error(
            "No dev chain provider URL but control chain is doodlechain. That's a programming error",
          );
        }
        this.primaryProvider = new ethers.JsonRpcProvider(
          config.devChainProviderURL,
        );
        context.components.primaryProvider = EComponentStatus.Available;
        return;
      }
      // Not the doodle chain
      // We need to figure out if we should use the infura provider or the RPC provider.
      if (
        config.apiKeys.primaryInfuraKey == null &&
        config.apiKeys.primaryRPCProviderURL == null
      ) {
        throw new Error("No primary provider URL or infura key!");
      }

      // Prefer infura if given
      if (config.apiKeys.primaryInfuraKey != null) {
        this.logUtils.log(
          `Configuring primary provider with InfuraProvider with primaryInfuraKey for network ${config.controlChainInformation.networkName}`,
        );
        // Leaving this here; Infura does not support Fuji yet, but when it does, we can move to the optimized provider
        // this.primaryProvider = new ethers.InfuraProvider(
        //   config.controlChainInformation.chainId,
        //   config.apiKeys.primaryInfuraKey,
        // );

        this.primaryProvider = new ethers.JsonRpcProvider(
          `https://${config.controlChainInformation.networkName}.infura.io/v3/${config.apiKeys.primaryInfuraKey}`,
        );
      } else {
        this.logUtils.log(
          `Configuring primary provider with RPCProvider with primaryRPCProviderURL ${config.apiKeys.primaryRPCProviderURL} for network ${config.controlChainInformation.networkName}`,
        );

        this.primaryProvider = new ethers.JsonRpcProvider(
          config.apiKeys.primaryRPCProviderURL!,
        );
      }
      context.components.primaryProvider = EComponentStatus.Available;

      // The secondary is optional, and depends on the config. We only have backups for non-devchains
      if (
        config.apiKeys.secondaryInfuraKey != null ||
        config.apiKeys.secondaryRPCProviderURL != null
      ) {
        // Prefer infura if given
        if (config.apiKeys.secondaryInfuraKey != null) {
          this.logUtils.log(
            `Configuring secondary provider with secondaryInfuraKey for network ${config.controlChainInformation.networkName}`,
          );
          // this.secondaryProvider = new ethers.InfuraProvider(
          //   config.controlChainInformation.chainId,
          //   config.apiKeys.secondaryInfuraKey,
          // );
          this.secondaryProvider = new ethers.JsonRpcProvider(
            `https://${config.controlChainInformation.networkName}.infura.io/v3/${config.apiKeys.secondaryInfuraKey}`,
          );
        } else {
          this.logUtils.log(
            `Configuring secondary provider with secondaryRPCProviderURL for network ${config.controlChainInformation.networkName}`,
          );
          this.secondaryProvider = new ethers.JsonRpcProvider(
            config.apiKeys.secondaryRPCProviderURL!,
          );
        }
        context.components.secondaryProvider = EComponentStatus.Available;
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
    ethers.JsonRpcProvider,
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
    ethers.JsonRpcProvider | null,
    BlockchainProviderError
  > {
    return this.waitForProviderPromise().map(() => {
      return this.secondaryProvider;
    });
  }

  public getLatestBlock(
    chainId: ChainId,
  ): ResultAsync<ethers.Block, BlockchainProviderError> {
    return this.getPrimaryProvider()
      .andThen((provider) => {
        return ResultAsync.fromPromise(provider.getBlock("latest"), (e) => {
          return new BlockchainProviderError(
            chainId,
            "Cannot retrieve latest block",
            e,
          );
        });
      })
      .andThen((block) => {
        if (block == null) {
          return errAsync(
            new BlockchainProviderError(
              chainId,
              "Cannot retrieve latest block",
            ),
          );
        }
        return okAsync(block);
      });
  }

  protected waitForProviderPromise(): ResultAsync<void, never> {
    if (this.providerInitializationResult == null) {
      throw new Error("Blockchain providers are not initialized yet");
    }

    return this.providerInitializationResult;
  }
}
