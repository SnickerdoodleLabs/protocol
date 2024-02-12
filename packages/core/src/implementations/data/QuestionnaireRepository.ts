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
  EVMContractAddress,
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
} from "@snickerdoodlelabs/objects";
import {
  IPersistenceConfigProviderType,
  IPersistenceConfigProvider,
  IPersistenceConfig,
} from "@snickerdoodlelabs/persistence";
import { inject, injectable } from "inversify";
import { Result, ResultAsync, ok, okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoin } from "url-join-ts";

import {
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  IQuestionnaireRepository,
} from "@core/interfaces/data/index.js";
import {
  IContextProviderType,
  IContextProvider,
} from "@core/interfaces/utilities/index.js";

@injectable()
export class QuestionnaireRepository implements IQuestionnaireRepository {
  constructor(
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IPersistenceConfigProviderType)
    protected configProvider: IPersistenceConfigProvider,
    @inject(IDataWalletPersistenceType)
    protected persistence: IDataWalletPersistence,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
    @inject(ITimeUtilsType) protected timeUtils: ITimeUtils,
  ) {}
  public getUnanswered(
    pagingRequest: PagingRequest,
    consentContractId?: EVMContractAddress | undefined,
  ): ResultAsync<PagedResponse<Questionnaire>, PersistenceError | AjaxError> {
    const lowerCount = (pagingRequest.page - 1) * pagingRequest.pageSize;
    const upperCount = lowerCount + pagingRequest.pageSize;

    const query = IDBKeyRange.bound(
      [EBoolean.FALSE, EQuestionnaireStatus.Available],
      [EBoolean.FALSE, EQuestionnaireStatus.Available],
    );

    return ResultUtils.combine([
      this.persistence.getCursor2<QuestionnaireData>(
        ERecordKey.QUESTIONNAIRES,
        {
          index: "deleted,data.status",
          query: query,
          lowerCount: lowerCount,
          upperCount: upperCount,
        },
      ),
      this.persistence.countRecords(ERecordKey.QUESTIONNAIRES, {
        index: "deleted,data.status",
        query: query,
      }),
    ]).map(([questionnaireDatas, totalCount]) => {
      // rank ? consent ?
      const result = questionnaireDatas.map<Questionnaire>(
        (questionnaireData) => {
          const questions =
            questionnaireData.questions.map<QuestionnaireQuestion>(
              (question) =>
                new QuestionnaireQuestion(
                  question.index,
                  question.type,
                  question.text,
                  question.choices,
                ),
            );

          return new Questionnaire(
            questionnaireData.id,
            MarketplaceTag("!!!!"),
            questionnaireData.status,
            questions,
          );
        },
      );
      return new PagedResponse(
        result,
        pagingRequest.page,
        pagingRequest.pageSize,
        totalCount,
      );
    });
  }
  public getAnswered(
    pagingRequest: PagingRequest,
    benchmark?: UnixTimestamp,
    consentContractId?: EVMContractAddress | undefined,
  ): ResultAsync<
    PagedResponse<QuestionnaireWithAnswers>,
    PersistenceError | AjaxError
  > {
    const lowerCount = (pagingRequest.page - 1) * pagingRequest.pageSize;
    const upperCount = lowerCount + pagingRequest.pageSize;

    const query = IDBKeyRange.bound(
      [EBoolean.FALSE, EQuestionnaireStatus.Complete],
      [EBoolean.FALSE, EQuestionnaireStatus.Complete],
    );

    return ResultUtils.combine([
      this.persistence.getCursor2<QuestionnaireData>(
        ERecordKey.QUESTIONNAIRES,
        {
          index: "deleted,data.status",
          query: query,
          lowerCount: lowerCount,
          upperCount: upperCount,
        },
      ),
      this.persistence.countRecords(ERecordKey.QUESTIONNAIRES, {
        index: "deleted,data.status",
        query: query,
      }),
    ]).andThen(([questionnaireDatas, totalCount]) => {
      return ResultUtils.combine(
        questionnaireDatas.map((questionnaireData) =>
          this.getByCID(questionnaireData.id, benchmark, true),
        ),
      ).map((questionnaireWithAnswers) => {
        const result =
          questionnaireWithAnswers as (QuestionnaireWithAnswers | null)[];
        const filteredResult = result.filter<QuestionnaireWithAnswers>(
          (data): data is QuestionnaireWithAnswers => data !== null,
        );
        return new PagedResponse(
          filteredResult,
          pagingRequest.page,
          pagingRequest.pageSize,
          totalCount,
        );
      });
    });
  }
  public getByCID(
    questionnaireCID: IpfsCID,
    benchmark?: UnixTimestamp,
    shouldHaveAnswer?: boolean,
  ): ResultAsync<
    Questionnaire | QuestionnaireWithAnswers | null,
    AjaxError | PersistenceError
  > {
    const query = IDBKeyRange.bound(
      [0, questionnaireCID, benchmark ?? 0],
      [0, questionnaireCID, this.timeUtils.getUnixNow()],
    );

    return ResultUtils.combine([
      this.persistence.get<QuestionnaireData>(ERecordKey.QUESTIONNAIRES, {
        index: "deleted",
        id: [EBoolean.FALSE, questionnaireCID],
      }),

      this.persistence.getCursor2<QuestionnaireHistory>(
        ERecordKey.QUESTIONNAIRES_HISTORY,
        {
          index: "deleted,data.id,data.measurementDate",
          query,
          latest: true,
        },
      ),
    ]).map(([questionnaireDatas, questionnaireHistories]) => {
      if (questionnaireDatas.length === 0) {
        return null;
      } else {
        const questionnaireData = questionnaireDatas[0];
        const questions =
          questionnaireData.questions.map<QuestionnaireQuestion>(
            (question) =>
              new QuestionnaireQuestion(
                question.index,
                question.type,
                question.text,
                question.choices,
              ),
          );

        if (questionnaireHistories.length > 0) {
          const answers =
            questionnaireHistories[0].answers.map<QuestionnaireAnswer>(
              (answer) =>
                new QuestionnaireAnswer(
                  answer.questionnaireId,
                  answer.questionIndex,
                  answer.choice,
                ),
            );

          return new QuestionnaireWithAnswers(
            questionnaireData.id,
            MarketplaceTag("!!!!"),
            questionnaireData.status,
            questions,
            answers,
          );
        } else {
          if (shouldHaveAnswer) {
            return null;
          }
          return new Questionnaire(
            questionnaireData.id,
            MarketplaceTag("!!!!"),
            questionnaireData.status,
            questions,
          );
        }
      }
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
    const historyRecord = new QuestionnaireHistory(
      id,
      this.timeUtils.getUnixNow(),
      answers,
    );
    return this.persistence.updateRecord(
      ERecordKey.QUESTIONNAIRES_HISTORY,
      historyRecord,
    );
  }

  public add(
    questionnaireCids: IpfsCID[],
  ): ResultAsync<void, AjaxError | PersistenceError> {
    return this.configProvider
      .getConfig()
      .andThen((config) =>
        ResultUtils.combine(
          questionnaireCids.map((cid) =>
            this.fetchQuestionnaireData(cid, config),
          ),
        ),
      )
      .andThen((results) => {
        const questionnaires = results.map(({ data, cid }) =>
          this.processQuestionnaireData(data, cid),
        );
        return this.updatePersistenceLayer(questionnaires).map(() => {});
      });
  }

  private fetchQuestionnaireData(
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

  private processQuestionnaireData(
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
        type: question.questionType,
        text: question.question,
        choices: question.choices || null,
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

  private updatePersistenceLayer(
    questionnaires: (QuestionnaireData | undefined)[],
  ): ResultAsync<void[], PersistenceError> {
    return ResultUtils.combine(
      questionnaires
        .filter(
          (questionnaire): questionnaire is QuestionnaireData =>
            questionnaire !== undefined,
        )
        .map((questionnaire) =>
          this.persistence.updateRecord(
            ERecordKey.QUESTIONNAIRES,
            questionnaire,
          ),
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
