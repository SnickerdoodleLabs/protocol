import {
  AjaxError,
  BlockchainCommonErrors,
  ConsentContractError,
  ConsentFactoryContractError,
  DomainName,
  EVMContractAddress,
  InvalidParametersError,
  IpfsCID,
  NewQuestionnaireAnswer,
  PagedResponse,
  PagingRequest,
  PersistenceError,
  Questionnaire,
  QuestionnaireWithAnswers,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IQuestionnaireService {
  /**
   * Returns a list of questionnaires that the user can complete (that do not already have answers),
   * without regard to any particular consent contract. They are returned in ranked order and should
   * be presented to the user in that order.
   * @param sourceDomain
   */
  getQuestionnaires(
    pagingRequest: PagingRequest,
    sourceDomain: DomainName | undefined,
  ): ResultAsync<
    PagedResponse<Questionnaire>,
    | UninitializedError
    | BlockchainCommonErrors
    | AjaxError
    | PersistenceError
    | ConsentFactoryContractError
  >;
  
  /**
   * Returns a list of questionnaires that the user can complete, which are requested by a particular
   * consent contract. They are returned in ranked order and should be presented to the user in that order.
   *
   * @param consentContractAddress
   * @param sourceDomain
   */
  getQuestionnairesForConsentContract(
    pagingRequest: PagingRequest,
    consentContractAddress: EVMContractAddress,
    sourceDomain: DomainName | undefined,
  ): ResultAsync<
    PagedResponse<Questionnaire>,
    | UninitializedError
    | BlockchainCommonErrors
    | AjaxError
    | PersistenceError
    | ConsentContractError
  >;

  /**
   * Gets all teh questionnaires that the user has already answered, along with the current answers
   * @param sourceDomain
   */
  getAnsweredQuestionnaires(
    pagingRequest: PagingRequest,
    sourceDomain: DomainName | undefined,
  ): ResultAsync<
    PagedResponse<QuestionnaireWithAnswers>,
    PersistenceError | AjaxError
  >;

  /**
   * This method provides answers to a single questionnaire. The provided answers must all
   * be for the same questionnaire. If the questionnaire is not found, or if the answers are
   * not valid, and InvalidParametersError is returned.
   * @param questionnaireId The IPFS CID of the questionnaire you are providing answers for.
   * @param answers
   */
  answerQuestionnaire(
    questionnaireId: IpfsCID,
    answers: NewQuestionnaireAnswer[],
    sourceDomain: DomainName | undefined,
  ): ResultAsync<void, InvalidParametersError | PersistenceError | AjaxError>;

  /**
   * Fetches all questionnaires in storage with pagination
   * This method can return either basic questionnaires or questionnaires with their answers if available,
   * */
  getAllQuestionnaires(
    pagingRequest: PagingRequest,
    _sourceDomain: DomainName | undefined,
  ): ResultAsync<
    PagedResponse<Questionnaire | QuestionnaireWithAnswers>,
    PersistenceError | AjaxError
  >;

  /**
   * Retrieves consent contract addresses associated with a given Questionnaire IPFS CID.
   *  This method is useful for finding out which consent contracts (brand) is interested in the the supplied Questionnaire
   *
   * @param ipfsCID The IPFS CID of the questionnaire
   * @return An array of consent contract addresses
   */
  getConsentContractsByQuestionnaireCID(
    ipfsCID: IpfsCID,
    sourceDomain: DomainName | undefined,
  ): ResultAsync<
    EVMContractAddress[],
    | PersistenceError
    | UninitializedError
    | ConsentFactoryContractError
    | BlockchainCommonErrors
    | ConsentContractError
    | AjaxError
  >;

  /**
   * This is a key marketing function. Based on the questionnaires that the user has answered,
   * this returns a list of consent contracts that are interested in that questionnaire. This is
   * where stake for rank comes in. Each questionnaire (regardless of if it's a default one or not),
   * can be staked by a consent contract.
   * @param sourceDomain
   */
  getRecommendedConsentContracts(
    questionnaire: IpfsCID,
    sourceDomain?: DomainName,
  ): ResultAsync<EVMContractAddress[], PersistenceError | AjaxError>;
}

export const IQuestionnaireServiceType = Symbol.for("IQuestionnaireService");
