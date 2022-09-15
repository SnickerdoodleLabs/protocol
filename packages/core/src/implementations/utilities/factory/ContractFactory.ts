import {
  ConsentContract,
  IConsentContract,
  ICrumbsContract,
  CrumbsContract,
  IMinimalForwarderContract,
  MinimalForwarderContract,
  IConsentFactoryContract,
  ConsentFactoryContract,
  SiftContract,
  ISiftContract,
} from "@snickerdoodlelabs/contracts-sdk";
import {
  BlockchainProviderError,
  ChainId,
  EVMContractAddress,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import {
  IBlockchainProvider,
  IBlockchainProviderType,
  IConfigProvider,
  IConfigProviderType,
} from "@core/interfaces/utilities";
import { IContractFactory } from "@core/interfaces/utilities/factory";

@injectable()
export class ContractFactory implements IContractFactory {
  public constructor(
    @inject(IBlockchainProviderType)
    protected blockchainProvider: IBlockchainProvider,
    @inject(IConfigProviderType)
    protected configProvider: IConfigProvider,
  ) {}
  public factoryConsentFactoryContract(): ResultAsync<
    IConsentFactoryContract,
    BlockchainProviderError | UninitializedError
  > {
    return ResultUtils.combine([
      this.blockchainProvider.getControlProvider(),
      this.configProvider.getConfig(),
    ]).map(([provider, config]) => {
      return new ConsentFactoryContract(
        provider,
        config.controlChainInformation.consentFactoryContractAddress,
      );
    });
  }

  public factoryConsentContracts(
    consentContractAddresses: EVMContractAddress[],
  ): ResultAsync<
    IConsentContract[],
    BlockchainProviderError | UninitializedError
  > {
    return this.blockchainProvider.getControlProvider().map((provider) => {
      return consentContractAddresses.map((consentContractAddress) => {
        return new ConsentContract(provider, consentContractAddress);
      });
    });
  }

  public factoryCrumbsContract(): ResultAsync<
    ICrumbsContract,
    BlockchainProviderError | UninitializedError
  > {
    return ResultUtils.combine([
      this.blockchainProvider.getControlProvider(),
      this.configProvider.getConfig(),
    ]).map(([provider, config]) => {
      return new CrumbsContract(
        provider,
        config.controlChainInformation.crumbsContractAddress,
      );
    });
  }

  public factoryMinimalForwarderContract(): ResultAsync<
    IMinimalForwarderContract,
    BlockchainProviderError | UninitializedError
  > {
    return ResultUtils.combine([
      this.blockchainProvider.getControlProvider(),
      this.configProvider.getConfig(),
    ]).map(([provider, config]) => {
      return new MinimalForwarderContract(
        provider,
        config.controlChainInformation.metatransactionForwarderAddress,
      );
    });
  }

  public factorySiftContract(): ResultAsync<
    ISiftContract,
    BlockchainProviderError | UninitializedError
  > {
    return ResultUtils.combine([
      this.blockchainProvider.getAllProviders(),
      this.configProvider.getConfig(),
    ]).map(([provider, config]) => {
      return new SiftContract(
        provider.get(config.controlChainId)!,
        config.controlChainInformation.siftContractAddress,
      );
    });
  }
}
