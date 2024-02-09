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

  public getQuestionnaires(
    pagingRequest: PagingRequest,
    sourceDomain: DomainName | undefined,
  ): ResultAsync<PagedResponse<Questionnaire>, PersistenceError | AjaxError> {
    return this.questionnaireRepo.getUnanswered(pagingRequest);
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
