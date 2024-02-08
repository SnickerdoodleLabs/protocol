import {
  Questionnaire,
  PersistenceError,
  AjaxError,
  QuestionnaireAnswer,
  InvalidParametersError,
  EVMContractAddress,
  IpfsCID,
  QuestionnaireWithAnswers,
  PagingRequest,
  PagedResponse,
} from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { ResultAsync, okAsync } from "neverthrow";

import { IQuestionnaireRepository } from "@core/interfaces/data/index.js";

@injectable()
export class QuestionnaireRepository implements IQuestionnaireRepository {
  /**
   * Returns a list of Questionnaires that the user has not yet provided answers for.
   * If the consentContractId is provided, only Questionnaires that are associated with
   * that consent contract are returned. If it is not provided, only
   * questionnaires from the ConsentContractFactory are returned. Questionnaires are always
   * returned sorted by priority where available.
   * @param consentContractId A particular consent contract.
   */
  getUnanswered(
    pagingRequest: PagingRequest,
    consentContractId?: EVMContractAddress | undefined,
  ): ResultAsync<PagedResponse<Questionnaire>, PersistenceError | AjaxError> {
    throw new Error("Method not implemented.");
  }

    /**
   * Returns a list of Questionnaires that the user has provided answers for, sorted by priority where available.
   * If a consentContractId is provided, returns questionnaires associated with that contract; otherwise, returns
   * questionnaires from the ConsentContractFactory. If a benchmark timestamp is given, the answers will reflect
   * the state at that time.
   * @param pagingRequest The paging request
   * @param benchmark Optional benchmark timestamp to consider when retrieving answered questionnaires.
   */
  getAnswered(
    pagingRequest: PagingRequest,
  ): ResultAsync<
    PagedResponse<QuestionnaireWithAnswers>,
    PersistenceError | AjaxError
  > {
    throw new Error("Method not implemented.");
  }
    /**
   * Returns a specific questionnaire by its CID. It may be answered or unanswered. If a benchmark timestamp is provided,
   * the answers will reflect the state of the questionnaire at that time.
   * @param questionnaireCID The CID of the specific questionnaire.
   * @param benchmark Optional benchmark timestamp to retrieve the questionnaire's state at a specific point in time.
   */
  getByCID(
    questionnaireCID: IpfsCID,
  ): ResultAsync<Questionnaire | QuestionnaireWithAnswers, AjaxError> {
    throw new Error("Method not implemented.");
  }

    /**
   * This method is provided as an optimization for the polling process. It returns a list of
   * the QuestionnaireIds that are currently cached locally, without having to construct the
   * complete Questionnaire objects.
   */
  getCachedQuestionnaireIds(): ResultAsync<IpfsCID[], PersistenceError> {
    return okAsync([]);
  }

  /**
   * This method will add a list of questionnaires to the local cache via their IPFS CID.
   * It should be called from a polling process that periodically checks for new questionnaires.
   * @param questionnaireCids the list of questionnaires to add to the cache
   */
  add(questionnaireCids: IpfsCID[]): ResultAsync<void, PersistenceError> {
    for (const cid in questionnaireCids) {
      cid;
    }
    throw new Error("Method not implemented.");
  }

  /**
   * Adds or updates answers to a questionnaire.
   * @param answers
   */
  upsertAnswers(
    answers: QuestionnaireAnswer[],
  ): ResultAsync<void, PersistenceError | AjaxError | InvalidParametersError> {
    throw new Error("Method not implemented.");
  }
}
