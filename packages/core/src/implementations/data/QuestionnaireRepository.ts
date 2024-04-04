import Crypto from "crypto";

import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ILogUtils,
  ILogUtilsType,
  ITimeUtils,
  ITimeUtilsType,
  ObjectUtils,
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
  QuestionnaireQuestion,
  UnixTimestamp,
  QuestionnaireHistory,
  EBoolean,
  MarketplaceTag,
  IQuestionnaireSchema,
  QuestionnaireSchema,
  SHA256Hash,
} from "@snickerdoodlelabs/objects";
import {
  IPersistenceConfigProviderType,
  IPersistenceConfigProvider,
  IPersistenceConfig,
} from "@snickerdoodlelabs/persistence";
import { inject, injectable } from "inversify";
import { validate } from "jsonschema";
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
      return this.getPagedQuestionnairesByCIDs(ids, pagingRequest);
    });
  }
  public getAnswered(
    pagingRequest: PagingRequest,
    benchmark?: UnixTimestamp,
  ): ResultAsync<
    PagedResponse<QuestionnaireWithAnswers>,
    PersistenceError | AjaxError
  > {
    return this.fetchQuestionnaireCIDs().andThen((cids) =>
      this.getPagedQuestionnairesByCIDs(
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
    return this.fetchQuestionnaireCIDs().andThen((cids) => {
      return this.getPagedQuestionnairesByCIDs(
        cids,
        pagingRequest,
        EQuestionnaireStatus.Available,
      );
    });
  }

  public getByCIDs(
    questionnaireCIDs: IpfsCID[],
    status?: EQuestionnaireStatus,
    benchmark?: UnixTimestamp,
  ): ResultAsync<
    (Questionnaire | QuestionnaireWithAnswers)[],
    AjaxError | PersistenceError
  > {
    return ResultUtils.combine(
      questionnaireCIDs.map((cid) => this.getByCID(cid, status, benchmark)),
    ).map((results) => {
      const nonNullResults = results.filter(
        (result): result is Questionnaire | QuestionnaireWithAnswers =>
          result !== null,
      );
      return nonNullResults;
    });
  }

  public getPagedQuestionnairesByCIDs(
    questionnaireCIDs: IpfsCID[],
    pagingRequest: PagingRequest,
    status?: EQuestionnaireStatus,
    benchmark?: UnixTimestamp,
  ): ResultAsync<
    PagedResponse<Questionnaire | QuestionnaireWithAnswers>,
    AjaxError | PersistenceError
  > {
    return this.getByCIDs(questionnaireCIDs, status, benchmark).map(
      (results) => {
        const { page, pageSize } = pagingRequest;
        const startIndex = (page - 1) * pageSize;
        const pagedResults = results.slice(startIndex, startIndex + pageSize);

        const pagedResponse = new PagedResponse(
          pagedResults,
          page,
          pageSize,
          results.length,
        );

        return pagedResponse;
      },
    );
  }

  public getByCID(
    questionnaireCID: IpfsCID,
    status?: EQuestionnaireStatus,
    benchmark?: UnixTimestamp,
  ): ResultAsync<
    Questionnaire | QuestionnaireWithAnswers | null,
    AjaxError | PersistenceError
  > {
    return this.fetchQuestionnaireDataById(questionnaireCID).andThen(
      (questionnaireData) => {
        if (questionnaireData == null) {
          return okAsync(null);
        }

        const questionHashesWithIndex = questionnaireData.questionHashes;

        return ResultUtils.combine(
          questionHashesWithIndex.map(([questionIndex, questionHash]) => {
            return this.fetchLatestQuestionnaireHistoriesById(
              questionHash,
              benchmark,
            ).map(
              (questionnaireHistory) =>
                [questionIndex, questionnaireHistory] as [
                  number,
                  QuestionnaireHistory[],
                ],
            );
          }),
        ).map((questionnaireHistories) => {
          const hasHistory = questionnaireHistories.some(
            ([, histories]) => histories.length > 0,
          );

          if (status === EQuestionnaireStatus.Available && hasHistory) {
            return null;
          } else if (status === EQuestionnaireStatus.Complete && !hasHistory) {
            return null;
          }

          return hasHistory
            ? this.constructQuestionnaireWithAnswers(
                questionnaireData,
                new Map(questionnaireHistories),
              )
            : this.constructQuestionnaire(questionnaireData);
        });
      },
    );
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

      const historyRecords = answers.map((answer) => {
        const correspondingQuestion = questionnaireData.questions.find(
          (q) => q.index === answer.questionIndex,
        );
        if (!correspondingQuestion) {
          throw new Error(
            `No matching question found for answer at index ${answer.questionIndex}`,
          );
        }
        const { index, ...questionHashPart } = correspondingQuestion;
        const { choice } = answer;
        const questionHash = this.getQuestionHash(questionHashPart);

        return new QuestionnaireHistory(
          questionHash,
          this.timeUtils.getUnixNow(),
          choice,
        );
      });

      return ResultUtils.combine(
        historyRecords.map((historyRecord) => {
          return this.persistence.updateRecord(
            ERecordKey.QUESTIONNAIRES_HISTORY,
            historyRecord,
          );
        }),
      ).map(() => {});
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

  private fetchQuestionnaireCIDs(): ResultAsync<
    IpfsCID[],
    PersistenceError | AjaxError
  > {
    return this.persistence
      .getCursor2<QuestionnaireData>(ERecordKey.QUESTIONNAIRES, {
        index: "deleted",
        query: EBoolean.FALSE,
      })
      .map((questionnaireDatas) => questionnaireDatas.map((data) => data.id));
  }

  private fetchQuestionnaireDataFromIPFS(
    cid: IpfsCID,
    config: IPersistenceConfig,
  ): ResultAsync<
    { data: Partial<IQuestionnaireSchema>; cid: IpfsCID },
    AjaxError
  > {
    const url = new URL(urlJoin(config.ipfsFetchBaseUrl, cid));
    return this.ajaxUtils
      .get<Partial<IQuestionnaireSchema>>(url)
      .map((data) => {
        return {
          // TODO better validation
          data: typeof data === "string" ? JSON.parse(data) : data,
          cid,
        };
      });
  }

  private processIPFSQuestionnaireData(
    data: Partial<IQuestionnaireSchema>,
    cid: IpfsCID,
  ): QuestionnaireData | undefined {
    const isValid = this.validateQuestionnaireData(data, cid);
    //TODO perhaps we can handle invalid IPFS cids later, not sure if it will benefit us
    if (!isValid) {
      return undefined;
    }

    const questions = data.questions.map<PropertiesOf<QuestionnaireQuestion>>(
      (question, questionIndex) => ({
        index: questionIndex,
        type: question.questionType,
        text: question.question,
        choices: question.options ?? null,
        minimum: question.minimum ?? null,
        maximum: question.maximum ?? null,
        displayType: question.displayType ?? null,
        multiSelect: question.multiSelect ?? false,
        required: question.isRequired ?? false,
        lowerLabel: question.lowerLabel ?? null,
        upperLabel: question.upperLabel ?? null,
      }),
    );

    const questionHashes = questions.map(
      ({ index, ...question }) =>
        [index, this.getQuestionHash(question)] as [number, SHA256Hash],
    );

    const newQuestionnaireData = new QuestionnaireData(
      cid,
      questions,
      data.title,
      questionHashes,
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
    questionHash: SHA256Hash,
    benchmark?: UnixTimestamp,
  ): ResultAsync<QuestionnaireHistory[], AjaxError | PersistenceError> {
    const query = IDBKeyRange.bound(
      [0, questionHash, 0],
      [0, questionHash, benchmark ?? this.timeUtils.getUnixNow()],
    );
    return this.persistence.getCursor2<QuestionnaireHistory>(
      ERecordKey.QUESTIONNAIRES_HISTORY,
      {
        index: "deleted,data.id,data.measurementDate",
        query,
        latest: true,
      },
    );
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
          question.minimum,
          question.maximum,
          question.displayType,
          question.multiSelect,
          question.required,
          question.lowerLabel,
          question.upperLabel,
        ),
    );

    return new Questionnaire(
      questionnaireData.id,
      MarketplaceTag(`Questionnaire:${questionnaireData.id}`),
      EQuestionnaireStatus.Available,
      questionnaireData.title,
      questionnaireData.description ?? null,
      questionnaireData.image ?? null,
      questions,
    );
  }

  private constructQuestionnaireWithAnswers(
    questionnaireData: QuestionnaireData,
    questionHistoryMap: Map<number, QuestionnaireHistory[]>,
  ): QuestionnaireWithAnswers {
    const questions: QuestionnaireQuestion[] = [];
    const allAnswers: QuestionnaireAnswer[] = [];
    let latestMeasurementDate: UnixTimestamp | null = null;
    console.log(`history `, questionHistoryMap);
    questionnaireData.questions.forEach((question) => {
      const questionInstance = new QuestionnaireQuestion(
        question.index,
        question.type,
        question.text,
        question.choices,
        question.minimum,
        question.maximum,
        question.displayType,
        question.multiSelect,
        question.required,
        question.lowerLabel,
        question.upperLabel,
      );
      questions.push(questionInstance);

      const questionHistories = questionHistoryMap.get(question.index);

      if (questionHistories != null && questionHistories.length > 0) {
        const [answer, measurementDate] = this.collectAnswer(
          questionHistories,
          question.index,
          questionnaireData.id,
        );

        allAnswers.push(answer);
        if (
          measurementDate != null &&
          (latestMeasurementDate == null ||
            measurementDate > latestMeasurementDate)
        ) {
          latestMeasurementDate = measurementDate;
        }
      }
    });

    return new QuestionnaireWithAnswers(
      questionnaireData.id,
      MarketplaceTag(`Questionnaire:${questionnaireData.id}`),
      EQuestionnaireStatus.Complete,
      questionnaireData.title,
      questionnaireData.description ?? null,
      questionnaireData.image ?? null,
      questions,
      allAnswers,
      //Should not be possible
      latestMeasurementDate ?? UnixTimestamp(0),
    );
  }

  private collectAnswer(
    questionnaireHistories: QuestionnaireHistory[],
    questionIndex: number,
    questionnaireId: IpfsCID,
  ): [QuestionnaireAnswer, UnixTimestamp | null] {
    const latestAnswer = questionnaireHistories[0].answer;
    const latestMeasurementDate = questionnaireHistories[0].measurementDate;

    return [
      new QuestionnaireAnswer(questionnaireId, questionIndex, latestAnswer),

      latestMeasurementDate,
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

  private getQuestionHash(
    question: PropertiesOf<Omit<QuestionnaireQuestion, "index">>,
  ): SHA256Hash {
    const questionString = ObjectUtils.serialize(question);

    const questionHash = Crypto.createHash("sha256")
      .update(questionString)
      .digest("hex");

    return SHA256Hash(questionHash);
  }

  private validateQuestionnaireData(
    data: Partial<IQuestionnaireSchema>,
    cid: IpfsCID,
  ): data is IQuestionnaireSchema {
    const validationResult = validate(data, QuestionnaireSchema);
    if (validationResult.valid) {
      return true;
    }

    const errorMessages = validationResult.errors.reduce<string>((acc, err) => {
      const pathString = ObjectUtils.serialize(err.path);
      const messageString = ObjectUtils.serialize(err.message);
      const errorMessage = `Problematic path: ${pathString}, Error message: ${messageString}\n`;
      return acc + errorMessage;
    }, "");

    this.logUtils.warning(
      `In processQuestionnaireData, received a malformed questionnaire, cid:${cid}.\n
    Error messages;
    ${errorMessages},
    Data: ${JSON.stringify(data)}\n`,
    );

    return false;
  }
}
