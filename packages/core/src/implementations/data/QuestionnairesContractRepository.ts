import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import {
  BlockchainProviderError,
  QuestionnairesContractError,
  IpfsCID,
  UninitializedError,
  BlockchainCommonErrors,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IQuestionnairesContractRepository } from "@core/interfaces/data/index.js";
import {
  IContractFactory,
  IContractFactoryType,
} from "@core/interfaces/utilities/factory/index.js";
import {
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities/index.js";

@injectable()
export class QuestionnairesContractRepository
  implements IQuestionnairesContractRepository
{
  public constructor(
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IContractFactoryType)
    protected questionnairesContractFactory: IContractFactory,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public getDefaultQuestionnaires(): ResultAsync<
    IpfsCID[],
    | BlockchainProviderError
    | UninitializedError
    | QuestionnairesContractError
    | BlockchainCommonErrors
  > {
    return this.questionnairesContractFactory
      .factoryQuestionnairesContract()
      .andThen((questionnairesContract) => {
        return questionnairesContract.getQuestionnaires();
      });
  }
}
