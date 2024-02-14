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
  SDQLString,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync, errAsync, okAsync } from "neverthrow";

import { IQuestionnaireRepository } from "@core/interfaces/data/index.js";
import { IConfigProvider, IConfigProviderType } from "@core/interfaces/utilities/index.js";
import { urlJoin } from "url-join-ts";
import { IAxiosAjaxUtils, IAxiosAjaxUtilsType } from "@snickerdoodlelabs/common-utils";

@injectable()
export class QuestionnaireRepository implements IQuestionnaireRepository {
  public constructor(
    @inject(IConfigProviderType)
    protected configProvider: IConfigProvider,
    @inject(IAxiosAjaxUtilsType)
    protected ajaxUtils: IAxiosAjaxUtils,
  ) {}

  getUnanswered(
    pagingRequest: PagingRequest,
    consentContractId?: EVMContractAddress | undefined,
  ): ResultAsync<PagedResponse<Questionnaire>, PersistenceError | AjaxError> {
    throw new Error("Method not implemented.");
  }

  public getAnswered(
    pagingRequest: PagingRequest,
  ): ResultAsync<
    PagedResponse<QuestionnaireWithAnswers>,
    PersistenceError | AjaxError
  > {
    throw new Error("Method not implemented.");
  }

  public getByCID(questionnaireCID: IpfsCID, benchmark?: UnixTimestamp): ResultAsync<Questionnaire, InvalidParametersError | AjaxError> {
    return this.configProvider.getConfig().andThen((config) => {
      const url = new URL(urlJoin(config.ipfsFetchBaseUrl, questionnaireCID));
      return this.ajaxUtils.get<Questionnaire>(url);
    }).map((questionnaire) => questionnaire);
  }

  public postQuestionnaire(questionnaireCID: IpfsCID, questionnaire: Questionnaire): ResultAsync<void, InvalidParametersError | AjaxError> {
    return this.configProvider.getConfig().andThen((config) => {
      const url = new URL(urlJoin(config.ipfsFetchBaseUrl, questionnaireCID));
      return this.ajaxUtils.post<void>(url, JSON.stringify(questionnaire));
    });
  }

  public getCachedQuestionnaireIds(): ResultAsync<IpfsCID[], PersistenceError> {
    return okAsync([]);
  }

  public add(questionnaireCids: IpfsCID[]): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  upsertAnswers(
    answers: QuestionnaireAnswer[],
  ): ResultAsync<void, PersistenceError | AjaxError | InvalidParametersError> {
    throw new Error("Method not implemented.");
  }
}
