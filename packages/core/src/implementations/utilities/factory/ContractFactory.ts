import {
  ICryptoUtils,
  ICryptoUtilsType,
  ILogUtils,
  ILogUtilsType,
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

import { ConsentContractWrapper } from "@core/implementations/utilities/factory/ConsentContractWrapper.js";
import { IContractFactory } from "@core/interfaces/utilities/factory/index.js";
import {
  IBlockchainProvider,
  IBlockchainProviderType,
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities/index.js";

@injectable()
export class ContractFactory implements IContractFactory {
  public constructor(
    @inject(IBlockchainProviderType)
    protected blockchainProvider: IBlockchainProvider,
    @inject(IConfigProviderType)
    protected configProvider: IConfigProvider,
    @inject(IContextProviderType)
    protected contextProvider: IContextProvider,
    @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
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
    return ResultUtils.combine([
      this.blockchainProvider.getPrimaryProvider(),
      this.blockchainProvider.getSecondaryProvider(),
    ]).map(([primaryProvider, secondaryProvider]) => {
      return consentContractAddresses.map((consentContractAddress) => {
        const primary = new ConsentContract(
          primaryProvider,
          consentContractAddress,
          this.cryptoUtils,
        );

        const secondary =
          secondaryProvider != null
            ? new ConsentContract(
                secondaryProvider,
                consentContractAddress,
                this.cryptoUtils,
              )
            : null;

        return new ConsentContractWrapper(
          primary,
          secondary,
          this.contextProvider,
          this.logUtils,
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
