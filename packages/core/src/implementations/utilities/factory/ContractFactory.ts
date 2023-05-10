import { IContractFactory } from "@core/interfaces/utilities/factory/index.js";
import {
  IBlockchainProvider,
  IBlockchainProviderType,
  IConfigProvider,
  IConfigProviderType,
} from "@core/interfaces/utilities/index.js";
import {
  ICryptoUtils,
  ICryptoUtilsType,
} from "@snickerdoodlelabs/common-utils";
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

@injectable()
export class ContractFactory implements IContractFactory {
  public constructor(
    @inject(IBlockchainProviderType)
    protected blockchainProvider: IBlockchainProvider,
    @inject(IConfigProviderType)
    protected configProvider: IConfigProvider,
    @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
  ) {}
  public factoryConsentFactoryContract(): ResultAsync<
    IConsentFactoryContract,
    BlockchainProviderError | UninitializedError
  > {
    return ResultUtils.combine([
      this.blockchainProvider.getPrimaryProvider(),
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
    return this.blockchainProvider.getPrimaryProvider().map((provider) => {
      return consentContractAddresses.map((consentContractAddress) => {
        return new ConsentContract(
          provider,
          consentContractAddress,
          this.cryptoUtils,
        );
      });
    });
  }

  public factoryCrumbsContract(): ResultAsync<
    ICrumbsContract,
    BlockchainProviderError | UninitializedError
  > {
    return ResultUtils.combine([
      this.blockchainProvider.getPrimaryProvider(),
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
      this.blockchainProvider.getPrimaryProvider(),
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
      this.blockchainProvider.getPrimaryProvider(),
      this.configProvider.getConfig(),
    ]).map(([provider, config]) => {
      return new SiftContract(
        provider,
        config.controlChainInformation.siftContractAddress,
      );
    });
  }
}
