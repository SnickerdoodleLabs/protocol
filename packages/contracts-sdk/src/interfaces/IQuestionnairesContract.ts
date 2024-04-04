import {
  EVMAccountAddress,
  IpfsCID,
  Signature,
  HexString,
  EVMContractAddress,
  InvalidParametersError,
  BlockchainCommonErrors,
  QuestionnairesContractError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { EConsentRoles } from "@contracts-sdk/interfaces/enums/index.js";
import { IBaseContract } from "@contracts-sdk/interfaces/IBaseContract.js";
import { IERC7529Contract } from "@contracts-sdk/interfaces/IERC7529Contract.js";
import {
  ContractOverrides,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/objects";

export interface IQuestionnairesContract
  extends IBaseContract,
    IERC7529Contract<QuestionnairesContractError> {
  /**
   * Gets the array of registered questionnaires
   */
  getQuestionnaires(): ResultAsync<
    IpfsCID[],
    BlockchainCommonErrors | QuestionnairesContractError
  >;

  /**
   * An authenticated function that allows for a new questionnaire CID to be added to the array
   * @param questionnaireCid the CID of a questionnaire to add to the discovery array
   * @param overrides for overriding transaction gas object
   */
  addQuestionnaire(
    questionnaireCid: IpfsCID,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | QuestionnairesContractError
  >;

  /**
   * Removes a questionnaire from the questionnaires array
   * @param index Index of questionnaire to remove
   * @param overrides for overriding transaction gas object
   */
  removeQuestionnaire(
    index: number,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | QuestionnairesContractError
  >;

  filters: IQuestionnaireContractFilters;
}

export interface IQuestionnaireContractFilters {}

export const IQuestionnairesContractType = Symbol.for(
  "IQuestionnairesContract",
);
