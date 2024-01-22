import {
  BlockchainCommonErrors,
  ConsentContractError,
  ConsentFactoryContractError,
  PersistenceError,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ICachingService {
  /**
   * This method will monitor the consent contract factory for Questionnaires, as well
   * as all opted-in consent contracts. It will try to assure that the questionnaire cache
   * contains all relevant questionnaires.
   */
  updateQuestionnaireCache(): ResultAsync<
    void,
    | PersistenceError
    | UninitializedError
    | ConsentFactoryContractError
    | BlockchainCommonErrors
    | ConsentContractError
  >;
}

export const ICachingServiceType = Symbol.for("ICachingService");
