import "reflect-metadata";
import { ILogUtils, ITimeUtils } from "@snickerdoodlelabs/common-utils";
import {
  EBoolean,
  EQuestionnaireStatus,
  ERecordKey,
  InvalidParametersError,
  PagedResponse,
  PagingRequest,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { IPersistenceConfigProvider } from "@snickerdoodlelabs/persistence";
import { okAsync } from "neverthrow";
import * as td from "testdouble";

import { QuestionnaireRepository } from "@core/implementations/data/QuestionnaireRepository.js";
import { IDataWalletPersistence } from "@core/interfaces/data";
import {
  IPFSQuestionnaireCID,
  mockIPFSQuestionnaire,
  mockQuestionnaireCID,
  mockQuestionnaireStoredInstance,
  mockQuestionnaireIPFSInstance,
  testCoreConfig,
  mockQuestionnaireAnswer,
  mockQuestionnaireHistory,
  mockQuestionnaireWithAnswer,
  mockQuestionnaireCID2,
  mockQuestionnaireStoredInstance2,
  mockQuestionnaire2,
} from "@core-tests/mock/mocks";
import { AjaxUtilsMock, ConfigProviderMock } from "@core-tests/mock/utilities";
import "fake-indexeddb/auto";
const currentTime = UnixTimestamp(1701779734);
const pagingRequest = new PagingRequest(1, 10);

class QuestionnaireRepositoryMocks {
  public persistence: IDataWalletPersistence;
  public configProvider: IPersistenceConfigProvider;
  public ajaxUtils: AjaxUtilsMock;
  public timeUtils: ITimeUtils;
  public logUtils: ILogUtils;

  public constructor() {
    this.persistence = td.object<IDataWalletPersistence>();
    this.configProvider = new ConfigProviderMock();
    this.timeUtils = td.object<ITimeUtils>();
    this.ajaxUtils = new AjaxUtilsMock();
    this.logUtils = td.object<ILogUtils>();

    this.ajaxUtils.addGetReturn(
      `${testCoreConfig.ipfsFetchBaseUrl}/${IPFSQuestionnaireCID}`,
      mockIPFSQuestionnaire,
    );
    td.when(this.timeUtils.getUnixNow()).thenReturn(currentTime);

    td.when(
      this.persistence.getKeys(td.matchers.anything(), td.matchers.anything()),
    ).thenReturn(
      okAsync([
        [mockQuestionnaireCID, EBoolean.FALSE],
        [mockQuestionnaireCID2, EBoolean.FALSE],
      ]),
    );

    td.when(
      this.persistence.get(ERecordKey.QUESTIONNAIRES, td.matchers.anything()),
    ).thenDo(
      (
        _storeName: string,
        query: {
          index?: string;
          query?: IDBValidKey | IDBKeyRange | null;
          count?: number;
          id?: IDBValidKey;
        },
      ) => {
        if (
          Array.isArray(query.id) &&
          query.id.includes(EBoolean.FALSE) &&
          query.id.includes(mockQuestionnaireCID)
        ) {
          return okAsync([mockQuestionnaireStoredInstance]);
        }
        if (
          Array.isArray(query.id) &&
          query.id.includes(EBoolean.FALSE) &&
          query.id.includes(mockQuestionnaireCID2)
        ) {
          return okAsync([mockQuestionnaireStoredInstance2]);
        }
        return okAsync([]);
      },
    );

    td.when(
      this.persistence.getCursor2(
        td.matchers.anything(),
        td.matchers.anything(),
      ),
    ).thenDo(
      (
        storeName: ERecordKey,
        query: {
          index?: string;
          query?: { lower: IDBValidKey[]; upper: IDBValidKey[] };
          count?: number;
          id?: IDBValidKey;
        },
      ) => {
        if (query.query) {
          const lowerBound = query.query.lower;
          const upperBound = query.query.upper;
          if (storeName === ERecordKey.QUESTIONNAIRES) {
            if (
              lowerBound.includes(EQuestionnaireStatus.Complete) ||
              lowerBound[1] === mockQuestionnaireCID
            ) {
              return okAsync([mockQuestionnaireStoredInstance]);
            }
            if (
              upperBound.includes(EQuestionnaireStatus.Available) ||
              upperBound[1] === mockQuestionnaireCID2
            ) {
              return okAsync([mockQuestionnaireStoredInstance2]);
            }
          }
          if (storeName === ERecordKey.QUESTIONNAIRES_HISTORY) {
            if (
              lowerBound.includes(EBoolean.FALSE) &&
              lowerBound[1] === mockQuestionnaireCID
            ) {
              return okAsync([mockQuestionnaireHistory]);
            }
          }
        }

        return okAsync([]);
      },
    );

    td.when(
      this.persistence.updateRecord(
        td.matchers.anything(),
        td.matchers.anything(),
      ),
    ).thenReturn(okAsync(undefined));
  }

  public factory(): QuestionnaireRepository {
    return new QuestionnaireRepository(
      this.configProvider,
      this.persistence,
      this.ajaxUtils,
      this.logUtils,
      this.timeUtils,
    );
  }
}

describe("QuestionnaireRepository tests", () => {
  test("add , does not attemp to add already existing Questionnaire", async () => {
    const mocks = new QuestionnaireRepositoryMocks();
    const repository = mocks.factory();

    const result = await repository.add([mockQuestionnaireCID]);

    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    td.verify(
      mocks.persistence.updateRecord(
        td.matchers.anything(),
        td.matchers.anything(),
      ),
      { times: 0 },
    );
  });

  test("add , adds new Questionnaire data", async () => {
    const mocks = new QuestionnaireRepositoryMocks();
    const repository = mocks.factory();

    const result = await repository.add([IPFSQuestionnaireCID]);

    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    td.verify(
      mocks.persistence.updateRecord(
        ERecordKey.QUESTIONNAIRES,
        mockQuestionnaireIPFSInstance,
      ),
      { times: 1 },
    );
  });

  test("upsertAnswer , adds new answer to non existing Questionnaire", async () => {
    const mocks = new QuestionnaireRepositoryMocks();
    const repository = mocks.factory();

    const result = await repository.upsertAnswers(
      IPFSQuestionnaireCID,
      mockQuestionnaireAnswer,
    );

    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();

    const err = result._unsafeUnwrapErr();
    expect(err).toBeInstanceOf(InvalidParametersError);
  });

  test("upsertAnswer , adds new answer to existing Questionnaire that already has answer", async () => {
    const mocks = new QuestionnaireRepositoryMocks();
    const repository = mocks.factory();

    const result = await repository.upsertAnswers(
      mockQuestionnaireCID,
      mockQuestionnaireAnswer,
    );

    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();

    td.verify(
      mocks.persistence.updateRecord(
        ERecordKey.QUESTIONNAIRES_HISTORY,
        td.matchers.anything(),
      ),
      { times: 1 },
    );
  });

  test("getQuestionnaireIds , returns existing ids", async () => {
    const mocks = new QuestionnaireRepositoryMocks();
    const repository = mocks.factory();

    const result = await repository.getQuestionnaireIds();

    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const response = result._unsafeUnwrap();

    expect(response).toEqual([mockQuestionnaireCID, mockQuestionnaireCID2]);
  });

  test("getByCID , returns Questionnaire with answer", async () => {
    const mocks = new QuestionnaireRepositoryMocks();
    const repository = mocks.factory();

    const result = await repository.getByCID(mockQuestionnaireCID);

    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const response = result._unsafeUnwrap();

    expect(response).toEqual(mockQuestionnaireWithAnswer);
  });

  test("getByCID , returns Questionnaire without history", async () => {
    const mocks = new QuestionnaireRepositoryMocks();
    const repository = mocks.factory();

    const result = await repository.getByCID(mockQuestionnaireCID2);

    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const response = result._unsafeUnwrap();

    expect(response).toEqual(mockQuestionnaire2);
  });

  test("getByCID , returns available Questionnaire", async () => {
    const mocks = new QuestionnaireRepositoryMocks();
    const repository = mocks.factory();

    const result = await repository.getByCID(
      mockQuestionnaireCID2,
      EQuestionnaireStatus.Available,
    );

    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const response = result._unsafeUnwrap();

    expect(response).toEqual(mockQuestionnaire2);
  });

  test("getByCID , wants available Questionnaire but it is completed , so it will return null", async () => {
    const mocks = new QuestionnaireRepositoryMocks();
    const repository = mocks.factory();

    const result = await repository.getByCID(
      mockQuestionnaireCID,
      EQuestionnaireStatus.Available,
    );

    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const response = result._unsafeUnwrap();

    expect(response).toEqual(null);
  });

  test("getByCID , wants available Questionnaire but it is completed , so it will return null", async () => {
    const mocks = new QuestionnaireRepositoryMocks();
    const repository = mocks.factory();

    const result = await repository.getByCID(
      mockQuestionnaireCID,
      EQuestionnaireStatus.Available,
    );

    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const response = result._unsafeUnwrap();

    expect(response).toEqual(null);
  });

  test("getByCIDs , will return both available and complete data", async () => {
    const mocks = new QuestionnaireRepositoryMocks();
    const repository = mocks.factory();

    const result = await repository.getByCIDs(
      [mockQuestionnaireCID, mockQuestionnaireCID2],
      pagingRequest,
    );

    const expectedPagedResponse = new PagedResponse(
      [mockQuestionnaireWithAnswer, mockQuestionnaire2],
      1,
      10,
      2,
    );

    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const response = result._unsafeUnwrap();

    expect(response).toEqual(expectedPagedResponse);
  });

  test("getByCIDs , cid order is diffrent , response order will reflect that ", async () => {
    const mocks = new QuestionnaireRepositoryMocks();
    const repository = mocks.factory();

    const result = await repository.getByCIDs(
      [mockQuestionnaireCID2, mockQuestionnaireCID],
      pagingRequest,
    );

    const expectedPagedResponse = new PagedResponse(
      [mockQuestionnaire2, mockQuestionnaireWithAnswer],
      1,
      10,
      2,
    );

    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const response = result._unsafeUnwrap();

    expect(response).toEqual(expectedPagedResponse);
  });

  test("getByCIDs , will return status available Questionnaire ", async () => {
    const mocks = new QuestionnaireRepositoryMocks();
    const repository = mocks.factory();

    const result = await repository.getByCIDs(
      [mockQuestionnaireCID, mockQuestionnaireCID2],
      pagingRequest,
      EQuestionnaireStatus.Available,
    );

    const expectedPagedResponse = new PagedResponse(
      [mockQuestionnaire2],
      1,
      10,
      1,
    );

    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const response = result._unsafeUnwrap();

    expect(response).toEqual(expectedPagedResponse);
  });

  test("getUnanswered , will get unanswered Questionnaire ", async () => {
    const mocks = new QuestionnaireRepositoryMocks();
    const repository = mocks.factory();

    const result = await repository.getUnanswered(pagingRequest);

    const expectedPagedResponse = new PagedResponse(
      [mockQuestionnaire2],
      1,
      10,
      1,
    );

    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const response = result._unsafeUnwrap();

    expect(response).toEqual(expectedPagedResponse);
  });

  test("getAnswered , will get answered Questionnaire ", async () => {
    const mocks = new QuestionnaireRepositoryMocks();
    const repository = mocks.factory();

    const result = await repository.getAnswered(pagingRequest);

    const expectedPagedResponse = new PagedResponse(
      [mockQuestionnaireWithAnswer],
      1,
      10,
      1,
    );

    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const response = result._unsafeUnwrap();

    expect(response).toEqual(expectedPagedResponse);
  });

  test("getAll , will get all Questionnaire ", async () => {
    const mocks = new QuestionnaireRepositoryMocks();
    const repository = mocks.factory();

    const result = await repository.getAll(pagingRequest);

    const expectedPagedResponse = new PagedResponse(
      [mockQuestionnaireWithAnswer, mockQuestionnaire2],
      1,
      10,
      2,
    );

    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const response = result._unsafeUnwrap();

    expect(response).toEqual(expectedPagedResponse);
  });
});
