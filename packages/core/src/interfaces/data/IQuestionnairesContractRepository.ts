import {
  BlockchainProviderError,
  UninitializedError,
  IpfsCID,
  BlockchainCommonErrors,
  QuestionnairesContractError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IQuestionnairesContractRepository {
  getDefaultQuestionnaires(): ResultAsync<
    IpfsCID[],
    | BlockchainProviderError
    | UninitializedError
    | QuestionnairesContractError
    | BlockchainCommonErrors
  >;
}

export const IQuestionnairesContractRepositoryType = Symbol.for(
  "IQuestionnairesContractRepository",
);
