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
import { ResultAsync } from "neverthrow";

import { IQuestionnaireRepository } from "@core/interfaces/data/index.js";

export class QuestionnaireRepository implements IQuestionnaireRepository {
  getUnanswered(
    pagingRequest: PagingRequest,
    consentContractId?: EVMContractAddress | undefined,
  ): ResultAsync<PagedResponse<Questionnaire>, PersistenceError | AjaxError> {
    throw new Error("Method not implemented.");
  }
  getAnswered(
    pagingRequest: PagingRequest,
  ): ResultAsync<
    PagedResponse<QuestionnaireWithAnswers>,
    PersistenceError | AjaxError
  > {
    throw new Error("Method not implemented.");
  }
  getByCID(
    questionnaireCID: IpfsCID,
  ): ResultAsync<Questionnaire | QuestionnaireWithAnswers, AjaxError> {
    throw new Error("Method not implemented.");
  }
  getCachedQuestionnaireIds(): ResultAsync<IpfsCID[], PersistenceError> {
    throw new Error("Method not implemented.");
  }
  add(questionnaireCids: IpfsCID[]): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }
  upsertAnswers(
    answers: QuestionnaireAnswer[],
  ): ResultAsync<void, PersistenceError | AjaxError | InvalidParametersError> {
    throw new Error("Method not implemented.");
  }
}
