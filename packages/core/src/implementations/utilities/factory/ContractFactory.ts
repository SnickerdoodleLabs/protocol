import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import {
  ConsentContract,
  IConsentContract,
  IConsentFactoryContract,
  ConsentFactoryContract,
  IQuestionnairesContract,
  QuestionnairesContract,
} from "@snickerdoodlelabs/contracts-sdk";
import { ICryptoUtils, ICryptoUtilsType } from "@snickerdoodlelabs/node-utils";
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
import { QuestionnairesContractWrapper } from "@core/implementations/utilities/factory/QuestionnairesContractWrapper.js";
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

  public factoryQuestionnairesContract(): ResultAsync<
    IQuestionnairesContract,
    BlockchainProviderError | UninitializedError
  > {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.blockchainProvider.getPrimaryProvider(),
      this.blockchainProvider.getSecondaryProvider(),
    ]).map(([config, primaryProvider, secondaryProvider]) => {
      const primary = new QuestionnairesContract(
        primaryProvider,
        config.controlChainInformation.questionnairesContractAddress,
      );

      const secondary =
        secondaryProvider != null
          ? new QuestionnairesContract(
              secondaryProvider,
              config.controlChainInformation.questionnairesContractAddress,
            )
          : null;

      return new QuestionnairesContractWrapper(
        primary,
        secondary,
        this.contextProvider,
        this.logUtils,
      );
    });
  }
}
