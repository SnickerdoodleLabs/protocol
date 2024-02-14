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
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync, errAsync, okAsync } from "neverthrow";

import { IQuestionnaireService } from "@core/interfaces/business/index.js";
import {
  IQuestionnaireRepository,
  IQuestionnaireRepositoryType,
} from "@core/interfaces/data/index.js";
import { IContextProvider, IContextProviderType } from "@core/interfaces/utilities/index.js";

@injectable()
export class QuestionnaireService implements IQuestionnaireService {
  public constructor(
    @inject(IQuestionnaireRepositoryType)
    protected questionnaireRepo: IQuestionnaireRepository,
    @inject(IContextProviderType)
    protected contextProvider: IContextProvider,
  ) {}

  public getQuestionnaires(
    pagingRequest: PagingRequest,
    sourceDomain: DomainName | undefined,
  ): ResultAsync<PagedResponse<Questionnaire>, PersistenceError | AjaxError> {
    return this.questionnaireRepo.getUnanswered(pagingRequest);
  }

  public addQuestionnaires(questionnaireCids: IpfsCID[]): ResultAsync<void, PersistenceError> {
    return this.questionnaireRepo.add(questionnaireCids)
  }

  public getQuestionnaire(questionnaireCID: IpfsCID, benchmark?: UnixTimestamp): ResultAsync<Questionnaire, InvalidParametersError | AjaxError> {
    return this.questionnaireRepo.getByCID(questionnaireCID, benchmark);
  }

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

  public getAnsweredQuestionnaires(
    pagingRequest: PagingRequest,
    sourceDomain: DomainName | undefined,
  ): ResultAsync<
    PagedResponse<QuestionnaireWithAnswers>,
    PersistenceError | AjaxError
  > {
    return this.questionnaireRepo.getAnswered(pagingRequest);
  }

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
