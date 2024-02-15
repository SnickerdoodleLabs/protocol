import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ILogUtils,
  ILogUtilsType,
  ITimeUtils,
  ITimeUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  Questionnaire,
  PersistenceError,
  AjaxError,
  QuestionnaireAnswer,
  InvalidParametersError,
  IpfsCID,
  QuestionnaireWithAnswers,
  PagingRequest,
  PagedResponse,
  PropertiesOf,
  QuestionnaireData,
  ERecordKey,
  EQuestionnaireStatus,
  IPFSQuestionnaire,
  QuestionnaireQuestion,
  UnixTimestamp,
  QuestionnaireHistory,
  EBoolean,
  MarketplaceTag,
  EQuestionnaireQuestionType,
  URLString,
} from "@snickerdoodlelabs/objects";
import {
  IPersistenceConfigProviderType,
  IPersistenceConfigProvider,
  IPersistenceConfig,
} from "@snickerdoodlelabs/persistence";
import { inject, injectable } from "inversify";
import { ResultAsync, errAsync, okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoin } from "url-join-ts";

import {
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  IQuestionnaireRepository,
} from "@core/interfaces/data/index.js";

@injectable()
export class QuestionnaireRepository implements IQuestionnaireRepository {
  constructor(
    @inject(IPersistenceConfigProviderType)
    protected configProvider: IPersistenceConfigProvider,
    @inject(IDataWalletPersistenceType)
    protected persistence: IDataWalletPersistence,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
    @inject(ITimeUtilsType) protected timeUtils: ITimeUtils,
  ) {}

  public getAll(
    pagingRequest: PagingRequest,
  ): ResultAsync<
    PagedResponse<Questionnaire | QuestionnaireWithAnswers>,
    PersistenceError | AjaxError
  > {
    return this.getQuestionnaireIds().andThen((ids) => {
      return this.getByCIDs(ids, pagingRequest);
    });
  }
  public getAnswered(
    pagingRequest: PagingRequest,
    benchmark?: UnixTimestamp,
  ): ResultAsync<
    PagedResponse<QuestionnaireWithAnswers>,
    PersistenceError | AjaxError
  > {
    return this.fetchQuestionnaireCIDsGivenStatus(
      EQuestionnaireStatus.Complete,
    ).andThen((cids) =>
      this.getByCIDs(
        cids,
        pagingRequest,
        EQuestionnaireStatus.Complete,
        benchmark,
      ).map((paginatedResult) => {
        return paginatedResult as PagedResponse<QuestionnaireWithAnswers>;
      }),
    );
  }

  public getUnanswered(
    pagingRequest: PagingRequest,
  ): ResultAsync<PagedResponse<Questionnaire>, PersistenceError | AjaxError> {
    return this.fetchQuestionnaireCIDsGivenStatus(
      EQuestionnaireStatus.Available,
    ).andThen((cids) =>
      this.getByCIDs(cids, pagingRequest, EQuestionnaireStatus.Available),
    );
  }
  public getByCIDs(
    questionnaireCIDs: IpfsCID[],
    pagingRequest: PagingRequest,
    status?: EQuestionnaireStatus,
    benchmark?: UnixTimestamp,
  ): ResultAsync<
    PagedResponse<Questionnaire | QuestionnaireWithAnswers>,
    AjaxError | PersistenceError
  > {
    return ResultUtils.combine(
      questionnaireCIDs.map((cid) => this.getByCID(cid, status, benchmark)),
    ).map((results) => {
      const nonNullResults = results.filter(
        (result): result is Questionnaire | QuestionnaireWithAnswers =>
          result !== null,
      );

      const { page, pageSize } = pagingRequest;
      const startIndex = (page - 1) * pageSize;
      const pagedResults = nonNullResults.slice(
        startIndex,
        startIndex + pageSize,
      );

      const pagedResponse = new PagedResponse(
        pagedResults,
        page,
        pageSize,
        nonNullResults.length,
      );

      return pagedResponse;
    });
  }

  public getByCID(
    questionnaireCID: IpfsCID,
    status?: EQuestionnaireStatus,
    benchmark?: UnixTimestamp,
  ): ResultAsync<
    Questionnaire | QuestionnaireWithAnswers | null,
    AjaxError | PersistenceError
  > {
    if (status === EQuestionnaireStatus.Available) {
      return this.fetchQuestionnaireDataById(questionnaireCID).map(
        (questionnaireData) => {
          if (
            questionnaireData == null ||
            questionnaireData.status !== EQuestionnaireStatus.Available
          ) {
            return null;
          }
          return this.constructQuestionnaire(questionnaireData);
        },
      );
    }
    return ResultUtils.combine([
      this.fetchQuestionnaireDataById(questionnaireCID),
      this.fetchLatestQuestionnaireHistoriesById(questionnaireCID, benchmark),
    ]).map(([questionnaireData, questionnaireHistories]) => {
      if (questionnaireData == null) {
        return null;
      }

      const hasHistory = questionnaireHistories.length > 0;

      if (hasHistory) {
        return this.constructQuestionnaireWithAnswers(
          questionnaireData,
          questionnaireHistories,
        );
      }

      if (status === EQuestionnaireStatus.Complete) {
        return null;
      }

      return this.constructQuestionnaire(questionnaireData);
    });
  }

  public getQuestionnaireIds(): ResultAsync<IpfsCID[], PersistenceError> {
    return this.persistence
      .getKeys(ERecordKey.QUESTIONNAIRES, {
        index: "deleted",
        query: EBoolean.FALSE,
      })
      .map((result) => {
        const ids = result as [[IpfsCID, EBoolean]];
        return ids.map(([id, _deleted]) => id);
      });
  }

  public upsertAnswers(
    id: IpfsCID,
    answers: QuestionnaireAnswer[],
  ): ResultAsync<void, PersistenceError | AjaxError | InvalidParametersError> {
    if (answers.length === 0) {
      return okAsync(undefined);
    }

    return this.fetchQuestionnaireDataById(id).andThen((questionnaireData) => {
      if (questionnaireData == null) {
        return errAsync(
          new InvalidParametersError(`While upserting answers to Questionnaire:${id} encountered error \n
           Questionnaire does not exist!`),
        );
      }

      const historyRecord = new QuestionnaireHistory(
        id,
        this.timeUtils.getUnixNow(),
        answers,
      );

      if (questionnaireData.status !== EQuestionnaireStatus.Complete) {
        questionnaireData.status = EQuestionnaireStatus.Complete;

        return ResultUtils.combine([
          this.persistence.updateRecord(
            ERecordKey.QUESTIONNAIRES_HISTORY,
            historyRecord,
          ),
          this.upsertQuestionnaireData([questionnaireData]),
        ]).map(() => {});
      }

      return this.persistence.updateRecord(
        ERecordKey.QUESTIONNAIRES_HISTORY,
        historyRecord,
      );
    });
  }

  public add(
    questionnaireCids: IpfsCID[],
  ): ResultAsync<void, AjaxError | PersistenceError> {
    return this.filterExistingQuestionnaireIds(questionnaireCids).andThen(
      (newCids) => {
        if (newCids.length === 0) {
          return okAsync(undefined);
        }
        return this.configProvider
          .getConfig()
          .andThen((config) =>
            ResultUtils.combine(
              newCids.map((cid) =>
                this.fetchQuestionnaireDataFromIPFS(cid, config),
              ),
            ),
          )
          .andThen((results) => {
            const questionnaires = results
              .map(({ data, cid }) =>
                this.processIPFSQuestionnaireData(data, cid),
              )
              .filter(
                (questionnaire): questionnaire is QuestionnaireData =>
                  questionnaire !== undefined,
              );
            return this.upsertQuestionnaireData(questionnaires).map(() => {});
          });
      },
    );
  }

  private filterExistingQuestionnaireIds(
    ids: IpfsCID[],
  ): ResultAsync<IpfsCID[], PersistenceError> {
    return this.getQuestionnaireIds().map((existingIds) => {
      const newIds = ids.filter((id) => !existingIds.includes(id));
      return newIds;
    });
  }

  private fetchQuestionnaireCIDsGivenStatus(
    status: EQuestionnaireStatus,
  ): ResultAsync<IpfsCID[], PersistenceError | AjaxError> {
    const query = IDBKeyRange.bound(
      [EBoolean.FALSE, status],
      [EBoolean.FALSE, status],
    );

    return this.persistence
      .getCursor2<QuestionnaireData>(ERecordKey.QUESTIONNAIRES, {
        index: "deleted,data.status",
        query: query,
      })
      .map((questionnaireDatas) => questionnaireDatas.map((data) => data.id));
  }

  private fetchQuestionnaireDataFromIPFS(
    cid: IpfsCID,
    config: IPersistenceConfig,
  ): ResultAsync<
    { data: Partial<IPFSQuestionnaire>; cid: IpfsCID },
    AjaxError
  > {
    const url = new URL(urlJoin(config.ipfsFetchBaseUrl, cid));
    return this.ajaxUtils
      .get<Partial<IPFSQuestionnaire>>(url)
      .map((data) => ({ data, cid }));
  }

  private processIPFSQuestionnaireData(
    data: Partial<IPFSQuestionnaire>,
    cid: IpfsCID,
  ): QuestionnaireData | undefined {
    const isValid = this.validateQuestionnaireData(data);
    //TODO perhaps we can handle invalid IPFS cids later, not sure if it will benefit us
    if (!isValid) {
      this.logUtils.warning(
        `In processQuestionnaireData, received a malformed questionnaire, cid:${cid}.\n
         Data:${data}
        `,
      );
      return undefined;
    }

    const questions = data.questions.map<PropertiesOf<QuestionnaireQuestion>>(
      (question, questionIndex) => ({
        index: questionIndex,
        type: question.type,
        text: question.text,
        choices: question.choices ?? null,
        minumum: question.minumum ?? null,
        maximum: question.maximum ?? null,
        multiSelect: question.multiSelect ?? false,
        required: question.required ?? false,
      }),
    );

    const newQuestionnaireData = new QuestionnaireData(
      cid,
      EQuestionnaireStatus.Available,
      questions,
      data.title,
      data.description,
      data.image,
    );

    return newQuestionnaireData;
  }

  private fetchQuestionnaireDataById(
    questionnaireCID: IpfsCID,
  ): ResultAsync<QuestionnaireData | null, AjaxError | PersistenceError> {
    return this.persistence
      .get<QuestionnaireData>(ERecordKey.QUESTIONNAIRES, {
        id: [questionnaireCID, EBoolean.FALSE],
      })
      .map((questionnaireDatas) => {
        return questionnaireDatas.length > 0 ? questionnaireDatas[0] : null;
      });
  }

  private fetchLatestQuestionnaireHistoriesById(
    questionnaireCID: IpfsCID,
    benchmark?: UnixTimestamp,
  ): ResultAsync<QuestionnaireHistory[], AjaxError | PersistenceError> {
    const query = IDBKeyRange.bound(
      [0, questionnaireCID, 0],
      [0, questionnaireCID, benchmark ?? this.timeUtils.getUnixNow()],
    );
    return this.persistence.getCursor2<QuestionnaireHistory>(
      ERecordKey.QUESTIONNAIRES_HISTORY,
      {
        index: "deleted,data.id,data.measurementDate",
        query,
        latest: true,
      },
    )
  }

  private constructQuestionnaire(
    questionnaireData: QuestionnaireData,
  ): Questionnaire {
    const questions = questionnaireData.questions.map(
      (question) =>
        new QuestionnaireQuestion(
          question.index,
          question.type,
          question.text,
          question.choices,
          question.minumum,
          question.maximum,
          question.multiSelect,
          question.required,
        ),
    );

    return new Questionnaire(
      questionnaireData.id,
      MarketplaceTag(`Questionnaire:${questionnaireData.id}`),
      questionnaireData.status,
      questionnaireData.title,
      questionnaireData.description,
      questionnaireData.image ?? null,
      questions,
      [],
    );
  }

  private constructQuestionnaireWithAnswers(
    questionnaireData: QuestionnaireData,
    questionnaireHistories: QuestionnaireHistory[],
  ): QuestionnaireWithAnswers {
    const questions = questionnaireData.questions.map(
      (question) =>
        new QuestionnaireQuestion(
          question.index,
          question.type,
          question.text,
          question.choices,
          question.minumum,
          question.maximum,
          question.multiSelect,
          question.required,
        ),
    );

    const [answers, measurementDate] = this.collectFullSetOfAnswers(
      questionnaireData.questions.length,
      questionnaireHistories,
    );

    return new QuestionnaireWithAnswers(
      questionnaireData.id,
      MarketplaceTag(`Questionnaire:${questionnaireData.id}`),
      questionnaireData.status,
      questionnaireData.title,
      questionnaireData.description,
      questionnaireData.image ?? null,
      questions,
      answers,
      measurementDate,
    );
  }

  private collectFullSetOfAnswers(
    totalQuestions: number,
    questionnaireHistories: QuestionnaireHistory[],
  ): [QuestionnaireAnswer[], UnixTimestamp] {
    const latestFullAnswers: PropertiesOf<QuestionnaireAnswer>[] = [];
    const answerTracker = new Set<number>();
    //questionnaireHistories are sorted
    const measurementDate = questionnaireHistories[0].measurementDate;
    for (const history of questionnaireHistories) {
      for (const answer of history.answers) {
        if (!answerTracker.has(answer.questionIndex)) {
          latestFullAnswers.push(answer);
          answerTracker.add(answer.questionIndex);
        }
      }

      if (answerTracker.size === totalQuestions) {
        break;
      }
    }

    return [
      latestFullAnswers.map(
        (answer) =>
          new QuestionnaireAnswer(
            answer.questionnaireId,
            answer.questionIndex,
            answer.choice,
          ),
      ),
      measurementDate,
    ];
  }
  private upsertQuestionnaireData(
    questionnaires: QuestionnaireData[],
  ): ResultAsync<void[], PersistenceError> {
    return ResultUtils.combine(
      questionnaires.map((questionnaire) =>
        this.persistence.updateRecord(ERecordKey.QUESTIONNAIRES, questionnaire),
      ),
    );
  }

  private validateQuestionnaireData(
    data: Partial<IPFSQuestionnaire>,
  ): data is IPFSQuestionnaire {
    //TODO better validation
    if (
      data.title != null &&
      data.description != null &&
      data.questions != null
    ) {
      return true;
    }
    return false;
  }
}
