import {
  AjaxError,
  EQueryProcessingStatus,
  EQuestionnaireStatus,
  EVMContractAddress,
  InvalidParametersError,
  IpfsCID,
  NewQuestionnaireAnswer,
  PagedResponse,
  PagingRequest,
  PersistenceError,
  Questionnaire,
  QuestionnaireAnswer,
  QuestionnaireWithAnswers,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

/**
 * The QuestionnaireRepository interface is responsible for storing and retrieving Questionnaires and their associated answers.
 * Questionnaires are primarily stored locally for performance reasons, while answers are always stored locally in indexDB.
 * Additionally, this repository interfaces with IPFS to store and retrieve Questionnaires. A separate polling process periodically checks for new Questionnaires and updates the local storage.
 * Importantly, this repository does not handle coordination with the blockchain; such requests should go through the questionnaire service.
 * Ergo Ranking information comes from the service through the blockchain, so as tags but currently we are using the default tag naming (e.g., Questionnaire:{IpfsCID of the questionnaire}).
 */
export interface IQuestionnaireRepository {
  /**
   * Returns a list of Questionnaires. If answers exist, it returns QuestionnaireWithAnswers.
   * @param pagingRequest The paging request for pagination.
   * @param benchmark Optional benchmark timestamp to consider when retrieving answered questionnaires.
   */
  getAll(
    pagingRequest: PagingRequest,
  ): ResultAsync<
    PagedResponse<Questionnaire | QuestionnaireWithAnswers>,
    PersistenceError | AjaxError
  >;

  /**
   * Returns a list of Questionnaires that the user has not yet provided answers for.
   * @param pagingRequest The paging request for pagination.
   */
  getUnanswered(
    pagingRequest: PagingRequest,
  ): ResultAsync<PagedResponse<Questionnaire>, PersistenceError | AjaxError>;

  /**
   * Returns QuestionnaireWithAnswers from the storage. If a benchmark timestamp is given, the answers will reflect the state at that time.
   * If no valid answer history exists, it returns an empty array in response.
   * @param pagingRequest The paging request for pagination.
   * @param benchmark Optional benchmark timestamp to consider when retrieving answered questionnaires.
   */
  getAnswered(
    pagingRequest: PagingRequest,
    benchmark?: UnixTimestamp,
  ): ResultAsync<
    PagedResponse<QuestionnaireWithAnswers>,
    PersistenceError | AjaxError
  >;

  /**
   * Returns a specific questionnaire by its CID, which may be answered or unanswered.
   * If a benchmark timestamp is provided, the answers will reflect the state of the questionnaire at that time.
   * @param questionnaireCID The CID of the specific questionnaire.
   * @param status The processing status of the questionnaire. If not provided, it returns Questionnaire or QuestionnaireWithAnswers if possible.
   * @param benchmark Optional benchmark timestamp to retrieve the questionnaire's state at a specific point in time.
   */
  getByCID(
    questionnaireCID: IpfsCID,
    status?: EQuestionnaireStatus,
    benchmark?: UnixTimestamp,
  ): ResultAsync<
    Questionnaire | QuestionnaireWithAnswers | null,
    AjaxError | PersistenceError
  >;

  /**
   * Returns a paged response containing questionnaires or questionnaires with answers, ordered according to the provided questionnaire CIDs.
   * If a benchmark timestamp is provided, the answers will reflect the state of the questionnaire at that time.
   * @param questionnaireCIDs An array of CIDs of the specific questionnaires.
   * @param pagingRequest Object containing paging parameters such as page number, page size, etc.
   * @param status The processing status of the questionnaire. If not provided, it returns Questionnaire or QuestionnaireWithAnswers if possible.
   * @param benchmark Optional benchmark timestamp to retrieve the questionnaire's state at a specific point in time. Should be given with status 'completed'.
   * If the questionnaire has no answers at the given benchmark, will return null.
   * @returns A paged response containing questionnaires or questionnaires with answers, preserving the order of questionnaireCIDs.
   */
  getPagedQuestionnairesByCIDs(
    questionnaireCIDs: IpfsCID[],
    pagingRequest: PagingRequest,
    status?: EQuestionnaireStatus,
    benchmark?: UnixTimestamp,
  ): ResultAsync<
    PagedResponse<Questionnaire | QuestionnaireWithAnswers>,
    AjaxError | PersistenceError
  >;

  /**
   * This method is provided as an optimization for the polling process.
   * It returns a list of the QuestionnaireIds that are currently stored locally, without having to construct the complete Questionnaire objects.
   */
  getQuestionnaireIds(): ResultAsync<IpfsCID[], PersistenceError>;

  /**
   * This method adds a list of questionnaires to the local cache via their IPFS CID.
   * It should be called from a polling process that periodically checks for new questionnaires.
   * @param questionnaireCids The list of questionnaires to add to the cache.
   */
  add(
    questionnaireCids: IpfsCID[],
  ): ResultAsync<void, AjaxError | PersistenceError>;

  /**
   * Adds answers to a questionnaire. Will update the questionnaire status if needed.
   * @param answers The answers to be added or updated.
   */
  upsertAnswers(
    id: IpfsCID,
    answers: NewQuestionnaireAnswer[],
  ): ResultAsync<void, InvalidParametersError | PersistenceError | AjaxError>;

  getByCIDs(
    questionnaireCIDs: IpfsCID[],
  ): ResultAsync<
    (Questionnaire | QuestionnaireWithAnswers)[],
    AjaxError | PersistenceError
  >;
}

export const IQuestionnaireRepositoryType = Symbol.for(
  "IQuestionnaireRepository",
);
