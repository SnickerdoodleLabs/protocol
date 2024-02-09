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
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync, errAsync } from "neverthrow";

import { IQuestionnaireService } from "@core/interfaces/business/index.js";
import {
  IQuestionnaireRepository,
  IQuestionnaireRepositoryType,
} from "@core/interfaces/data/index.js";

@injectable()
export class QuestionnaireService implements IQuestionnaireService {
  public constructor(
    @inject(IQuestionnaireRepositoryType)
    protected questionnaireRepo: IQuestionnaireRepository,
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
    console.log("inside getQuestionnaires! ");
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
    for (const answer of answers) {
      if (answer.questionnaireId !== questionnaireId) {
        return errAsync(
          new InvalidParametersError(
            "All answers must be for the same questionnaire",
          ),
        );
      }
    }

    // Get the questionnaire
    return this.questionnaireRepo
      .getByCID(questionnaireId)
      .andThen((questionnaire) => {
        if (questionnaire == null) {
          return errAsync(
            new InvalidParametersError("The questionnaire could not be found"),
          );
        }

        // Validate that the answers are valid for the questionnaire
        // TODO;
        return this.questionnaireRepo.upsertAnswers(answers);
      });
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
