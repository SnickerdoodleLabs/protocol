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
  SiftContract,
  ISiftContract,
  ConsentFactoryContract,
} from "@snickerdoodlelabs/contracts-sdk";
import {
  BlockchainProviderError,
  EVMContractAddress,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { ConsentContractWrapper } from "@core/implementations/utilities/factory/ConsentContractWrapper.js";
import { ConsentFactoryContractWrapper } from "@core/implementations/utilities/factory/ConsentFactoryContractWrapper.js";
import { CrumbsContractWrapper } from "@core/implementations/utilities/factory/CrumbsContractWrapper.js";
import { MinimalForwarderContractWrapper } from "@core/implementations/utilities/factory/MinimalForwarderContractWrapper.js";
import { SiftContractWrapper } from "@core/implementations/utilities/factory/SiftContractWrapper.js";
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
      this.configProvider.getConfig(),
      this.blockchainProvider.getPrimaryProvider(),
      this.blockchainProvider.getSecondaryProvider(),
    ]).map(([config, primaryProvider, secondaryProvider]) => {
      const primary = new ConsentFactoryContract(
        primaryProvider,
        config.controlChainInformation.consentFactoryContractAddress,
      );

      const secondary =
        secondaryProvider != null
          ? new ConsentFactoryContract(
              secondaryProvider,
              config.controlChainInformation.consentFactoryContractAddress,
            )
          : null;

      return new ConsentFactoryContractWrapper(
        primary,
        secondary,
        this.contextProvider,
        this.logUtils,
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
      this.configProvider.getConfig(),
      this.blockchainProvider.getPrimaryProvider(),
      this.blockchainProvider.getSecondaryProvider(),
    ]).map(([config, primaryProvider, secondaryProvider]) => {
      const primary = new CrumbsContract(
        primaryProvider,
        config.controlChainInformation.consentFactoryContractAddress,
      );

      const secondary =
        secondaryProvider != null
          ? new CrumbsContract(
              secondaryProvider,
              config.controlChainInformation.consentFactoryContractAddress,
            )
          : null;

      return new CrumbsContractWrapper(
        primary,
        secondary,
        this.contextProvider,
        this.logUtils,
      );
    });
  }

  public factoryMinimalForwarderContract(): ResultAsync<
    IMinimalForwarderContract,
    BlockchainProviderError | UninitializedError
  > {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.blockchainProvider.getPrimaryProvider(),
      this.blockchainProvider.getSecondaryProvider(),
    ]).map(([config, primaryProvider, secondaryProvider]) => {
      const primary = new MinimalForwarderContract(
        primaryProvider,
        config.controlChainInformation.metatransactionForwarderAddress,
      );

      const secondary =
        secondaryProvider != null
          ? new MinimalForwarderContract(
              secondaryProvider,
              config.controlChainInformation.metatransactionForwarderAddress,
            )
          : null;

      return new MinimalForwarderContractWrapper(
        primary,
        secondary,
        this.contextProvider,
        this.logUtils,
      );
    });
  }

  public factorySiftContract(): ResultAsync<
    ISiftContract,
    BlockchainProviderError | UninitializedError
  > {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.blockchainProvider.getPrimaryProvider(),
      this.blockchainProvider.getSecondaryProvider(),
    ]).map(([config, primaryProvider, secondaryProvider]) => {
      const primary = new SiftContract(
        primaryProvider,
        config.controlChainInformation.siftContractAddress,
      );

      const secondary =
        secondaryProvider != null
          ? new SiftContract(
              secondaryProvider,
              config.controlChainInformation.siftContractAddress,
            )
          : null;

      return new SiftContractWrapper(
        primary,
        secondary,
        this.contextProvider,
        this.logUtils,
      );
    });
  }
}
