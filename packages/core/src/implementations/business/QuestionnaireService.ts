import {
  DomainName,
  Questionnaire,
  PersistenceError,
  EVMContractAddress,
  PagingRequest,
  PagedResponse,
  QuestionnaireWithAnswers,
  IpfsCID,
  NewQuestionnaireAnswer,
  InvalidParametersError,
  AjaxError,
  SDQLQuery,
  DataPermissions,
  QuestionnairePerformanceEvent,
  EQueryEvents,
  EStatus,
  QuestionnaireQuestion,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync, errAsync, okAsync } from "neverthrow";

import { IQuestionnaireService } from "@core/interfaces/business/index.js";
import {
  IQuestionnaireRepository,
  IQuestionnaireRepositoryType,
} from "@core/interfaces/data/index.js";
import { IQueryParsingEngine, IQueryParsingEngineType } from "@core/interfaces/business/utilities/index.js";
import { IContextProvider, IContextProviderType } from "@core/interfaces/utilities/index.js";
import { ResultUtils } from "neverthrow-result-utils";

@injectable()
export class QuestionnaireService implements IQuestionnaireService {
  public constructor(
    @inject(IQuestionnaireRepositoryType)
    protected questionnaireRepo: IQuestionnaireRepository,
    @inject(IQueryParsingEngineType)
    protected queryParsingEngine: IQueryParsingEngine,
    @inject(IContextProviderType)
    protected contextProvider: IContextProvider,
  ) {}

  /**
   * Returns a list of questionnaires that the user can complete (that do not already have answers),
   * without regard to any particular consent contract. They are returned in ranked order and should
   * be presented to the user in that order.
   * @param sourceDomain
   */
  public getQuestionnaires(
    pagingRequest: PagingRequest,
    sourceDomain: DomainName | undefined,
  ): ResultAsync<PagedResponse<Questionnaire>, PersistenceError | AjaxError> {
    return this.questionnaireRepo.getUnanswered(pagingRequest);
  }

  /**
   * This is a key marketing function. Based on the questionnaires that the user has answered,
   * this returns a list of consent contracts that are interested in that questionnaire. This is
   * where stake for rank comes in. Each questionnaire (regardless of if it's a default one or not),
   * can be staked by a consent contract.
   * @param sourceDomain
   */
    public addQuestionnaires(questionnaireCids: IpfsCID[]): ResultAsync<void, PersistenceError> {
      return this.questionnaireRepo.add(questionnaireCids)
    }

    public getQuestionnaire(questionnaireCID: IpfsCID, benchmark?: UnixTimestamp): ResultAsync<Questionnaire, InvalidParametersError | AjaxError> {
      // return errAsync(new InvalidParametersError(""))
      return this.questionnaireRepo.getByCID(questionnaireCID, benchmark);
    }

    /**
   * Returns a list of questionnaires that the user can complete, which are requested by a particular
   * consent contract. They are returned in ranked order and should be presented to the user in that order.
   *
   * @param pagingRequest
   * @param consentContractAddress
   * @param sourceDomain
   */
  public getQuestionnairesForConsentContract(
    pagingRequest: PagingRequest,
    consentContractAddress: EVMContractAddress,
    sourceDomain: DomainName | undefined,
  ): ResultAsync<PagedResponse<Questionnaire>, PersistenceError | AjaxError> {
    return this.questionnaireRepo.getUnanswered(
      pagingRequest,
      consentContractAddress,
    );
  }

  /**
   * Gets all the questionnaires that the user has already answered, along with the current answers
   * @param sourceDomain
   */
  public getAnsweredQuestionnaires(
    pagingRequest: PagingRequest,
    sourceDomain: DomainName | undefined,
  ): ResultAsync<
    PagedResponse<QuestionnaireWithAnswers>,
    PersistenceError | AjaxError
  > {
    return this.questionnaireRepo.getAnswered(pagingRequest);
  }

  /**
   * This method provides answers to a single questionnaire. The provided answers must all
   * be for the same questionnaire. If the questionnaire is not found, or if the answers are
   * not valid, InvalidParametersError is returned.
   * @param questionnaireId The IPFS CID of the questionnaire you are providing answers for.
   * @param answers
   */
  public answerQuestionnaire(
    questionnaireId: IpfsCID,
    answers: NewQuestionnaireAnswer[],
    sourceDomain: DomainName | undefined,
  ): ResultAsync<void, PersistenceError | AjaxError | InvalidParametersError> {
    // Validate that the answers are for the same questionnaire
    // Get the questionnaire
    return this.questionnaireRepo
      .getByCID(questionnaireId)
      .andThen((questionnaire) => {
        if (questionnaire == null) {
          return errAsync(
            new InvalidParametersError("The questionnaire could not be found"),
          );
        }

        for (const answer of answers) {
          if (answer.questionnaireId !== questionnaireId) {
            return errAsync(
              new InvalidParametersError(
                "All answers must be for the same questionnaire",
              ),
            );
          }

          const question = questionnaire.questions[answer.questionIndex];
          if (question.choices != null) {
            if (answer.choice != null) {
              if ((answer.choice <= 0) || (answer.choice >= question.choices.length)) {
                return errAsync(
                  new InvalidParametersError(
                    "Choice does not exist on the Questionnaire",
                  ),
                );
              }
            }
          }
        }

        return this.questionnaireRepo.upsertAnswers(answers);
      });
  }

  public postQuestionnaire(questionnaireCID: IpfsCID, questionnaire: Questionnaire): ResultAsync<void, InvalidParametersError | AjaxError> {
    return this.questionnaireRepo.postQuestionnaire(questionnaireCID, questionnaire);
  }

    /**
   * This is a key marketing function. Based on the questionnaires that the user has answered,
   * this returns a list of consent contracts that are interested in that questionnaire. This is
   * where stake for rank comes in. Each questionnaire (regardless of if it's a default one or not),
   * can be staked by a consent contract.
   * @param sourceDomain
   */
  public getRecommendedConsentContracts(
    questionnaire: IpfsCID,
    sourceDomain?: DomainName | undefined,
  ): ResultAsync<EVMContractAddress[], PersistenceError> {
    // TODO: Big fat TODO here.
    // Basic idea, we need to go to the Consent Contract Factory and get the list of
    // consent contracts that have staked against the questionnaire.
    throw new Error("Method not implemented.");
  }
}
