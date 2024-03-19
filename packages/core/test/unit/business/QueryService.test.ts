import {
  ILogUtils,
  ITimeUtils,
  ObjectUtils,
} from "@snickerdoodlelabs/common-utils";
import { IInsightPlatformRepository } from "@snickerdoodlelabs/insight-platform-api";
import { ICryptoUtils } from "@snickerdoodlelabs/node-utils";
import {
  BlockNumber,
  DataPermissions,
  EQueryProcessingStatus,
  ERewardType,
  EVMContractAddress,
  EVMPrivateKey,
  EarnedReward,
  IDynamicRewardParameter,
  IPFSError,
  IpfsCID,
  ESolidityAbiParameterType,
  PersistenceError,
  QueryStatus,
  SDQLQuery,
  SDQLQueryRequest,
  SDQLString,
  TokenId,
  UninitializedError,
  UnixTimestamp,
  IQueryDeliveryItems,
  OptInInfo,
} from "@snickerdoodlelabs/objects";
import {
  ISDQLQueryWrapperFactory,
  avalanche1SchemaStr,
  questionnaireQuery,
} from "@snickerdoodlelabs/query-parser";
import { errAsync, okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import "reflect-metadata";
import * as td from "testdouble";

import { QueryService } from "@core/implementations/business/index.js";
import { IQuestionnaireService } from "@core/interfaces/business";
import { IQueryParsingEngine } from "@core/interfaces/business/utilities/index.js";
import {
  IConsentContractRepository,
  ILinkedAccountRepository,
  ISDQLQueryRepository,
} from "@core/interfaces/data/index.js";
import {
  IConfigProvider,
  IDataWalletUtils,
} from "@core/interfaces/utilities/index.js";
import {
  avalanche1AstInstance,
  commitment1,
  commitment1Index,
  dataWalletKey,
  defaultInsightPlatformBaseUrl,
  identityNullifier,
  identityTrapdoor,
} from "@core-tests/mock/mocks/index.js";
import {
  ConfigProviderMock,
  ContextProviderMock,
} from "@core-tests/mock/utilities/index.js";

const now = UnixTimestamp(12345);
const then = UnixTimestamp(2345);
const consentContractAddress = EVMContractAddress("Phoebe");
const queryCID1 = IpfsCID("Beep");
const queryCID2 = IpfsCID("Boop");
const queryCID3 = IpfsCID("Womp");

const derivedPrivateKey = EVMPrivateKey("derivedPrivateKey");
const sdqlQuery = new SDQLQuery(queryCID1, SDQLString(avalanche1SchemaStr));
const sdqlQuery2 = new SDQLQuery(queryCID2, SDQLString(avalanche1SchemaStr));
const sdqlQuery3 = new SDQLQuery(queryCID3, SDQLString(questionnaireQuery));

const queryDeliveryItems: IQueryDeliveryItems = {
  insights: {},
  ads: {},
} as IQueryDeliveryItems; // TODO fill out with data

const tokenId = TokenId(BigInt(0));

const dataPermissions = new DataPermissions("" as EVMContractAddress, [], []);

const rewardParameter = {
  recipientAddress: {
    type: ESolidityAbiParameterType.address,
    value: "Phoebe",
  },
  compensationKey: {
    type: ESolidityAbiParameterType.string,
    value: "c1",
  },
} as IDynamicRewardParameter;

const rewardParameters = [rewardParameter];

const receivedQueryStatus = new QueryStatus(
  consentContractAddress,
  queryCID1,
  BlockNumber(345),
  EQueryProcessingStatus.Received,
  then,
  null,
);

const adsCompletedQueryStatus = new QueryStatus(
  consentContractAddress,
  queryCID2,
  BlockNumber(123),
  EQueryProcessingStatus.AdsCompleted,
  then,
  ObjectUtils.serialize(rewardParameters),
);

const earnedReward = new EarnedReward(
  queryCID1,
  "rewardName",
  null,
  "description",
  ERewardType.Direct,
);

const earnedRewards = [earnedReward];
const commitmentIndex = 1;

const optInInfo = new OptInInfo(
  consentContractAddress,
  identityNullifier,
  identityTrapdoor,
  commitment1,
);

class QueryServiceMocks {
  public dataWalletUtils: IDataWalletUtils;
  public queryParsingEngine: IQueryParsingEngine;
  public questionnaireService: IQuestionnaireService;
  public sdqlQueryRepo: ISDQLQueryRepository;
  public insightPlatformRepo: IInsightPlatformRepository;
  public consentContractRepo: IConsentContractRepository;
  public contextProvider: ContextProviderMock;
  public configProvider: IConfigProvider;
  public cryptoUtils: ICryptoUtils;
  public accountRepo: ILinkedAccountRepository;
  public timeUtils: ITimeUtils;
  public sdqlQueryWrapperFactory: ISDQLQueryWrapperFactory;
  public logUtils: ILogUtils;

  public constructor() {
    this.dataWalletUtils = td.object<IDataWalletUtils>();
    this.queryParsingEngine = td.object<IQueryParsingEngine>();
    this.questionnaireService = td.object<IQuestionnaireService>();
    this.sdqlQueryRepo = td.object<ISDQLQueryRepository>();
    this.insightPlatformRepo = td.object<IInsightPlatformRepository>();
    this.consentContractRepo = td.object<IConsentContractRepository>();
    this.contextProvider = new ContextProviderMock();
    this.configProvider = new ConfigProviderMock();
    this.cryptoUtils = td.object<ICryptoUtils>();
    this.accountRepo = td.object<ILinkedAccountRepository>();
    this.sdqlQueryWrapperFactory = td.object<ISDQLQueryWrapperFactory>();
    this.logUtils = td.object<ILogUtils>();
    this.timeUtils = td.object<ITimeUtils>();

    td.when(
      this.insightPlatformRepo.deliverInsights(
        consentContractAddress,
        identityTrapdoor,
        identityNullifier,
        queryCID2,
        queryDeliveryItems,
        td.matchers.argThat((val: IDynamicRewardParameter[]) => {
          return (
            val.length == 1 &&
            val[0].compensationKey.type ==
              rewardParameter.compensationKey.type &&
            val[0].compensationKey.value ==
              rewardParameter.compensationKey.value &&
            val[0].recipientAddress.type ==
              rewardParameter.recipientAddress.type &&
            val[0].recipientAddress.value ==
              rewardParameter.recipientAddress.value
          );
        }),
        [commitment1],
        0, //anonymitySetStart
        defaultInsightPlatformBaseUrl,
      ),
    ).thenReturn(okAsync(earnedRewards));

    // SDQLQueryRepository ---------------------------------------------------------
    td.when(this.sdqlQueryRepo.getSDQLQueryByCID(queryCID1)).thenReturn(
      okAsync(sdqlQuery),
    );
    td.when(this.sdqlQueryRepo.getSDQLQueryByCID(queryCID2)).thenReturn(
      okAsync(sdqlQuery2),
    );
    td.when(this.sdqlQueryRepo.getSDQLQueryByCID(queryCID3)).thenReturn(
      okAsync(sdqlQuery3),
    );
    td.when(this.sdqlQueryRepo.getQueryStatusByQueryCID(queryCID1)).thenReturn(
      okAsync(receivedQueryStatus),
    );
    td.when(this.sdqlQueryRepo.getQueryStatusByQueryCID(queryCID2)).thenReturn(
      okAsync(adsCompletedQueryStatus),
    );
    td.when(
      this.sdqlQueryRepo.getQueryStatusByStatus(
        EQueryProcessingStatus.Received,
      ),
    ).thenReturn(okAsync([receivedQueryStatus]));
    td.when(
      this.sdqlQueryRepo.getQueryStatusByStatus(
        EQueryProcessingStatus.AdsCompleted,
      ),
    ).thenReturn(okAsync([adsCompletedQueryStatus]));
    td.when(
      this.sdqlQueryRepo.upsertQueryStatus([
        td.matchers.contains(
          new QueryStatus(
            receivedQueryStatus.consentContractAddress,
            receivedQueryStatus.queryCID,
            receivedQueryStatus.receivedBlock,
            EQueryProcessingStatus.AdsCompleted,
            receivedQueryStatus.expirationDate,
            ObjectUtils.serialize(rewardParameters),
          ),
        ),
      ]),
    ).thenReturn(okAsync(undefined));
    td.when(
      this.sdqlQueryRepo.upsertQueryStatus([
        td.matchers.contains(
          new QueryStatus(
            consentContractAddress,
            queryCID2,
            adsCompletedQueryStatus.receivedBlock,
            EQueryProcessingStatus.RewardsReceived,
            adsCompletedQueryStatus.expirationDate,
            ObjectUtils.serialize(rewardParameters),
          ),
        ),
      ]),
    ).thenReturn(okAsync(undefined));

    // ConsentContractRepository ---------------------------------------------
    td.when(
      this.consentContractRepo.getCommitmentIndex(consentContractAddress),
    ).thenReturn(okAsync(commitmentIndex));
    td.when(
      this.dataWalletUtils.deriveOptInInfo(
        consentContractAddress,
        dataWalletKey,
      ),
    ).thenReturn(okAsync(optInInfo));
    td.when(
      this.consentContractRepo.getCommitmentIndex(consentContractAddress),
    ).thenReturn(okAsync(commitment1Index));
    td.when(
      this.consentContractRepo.getCommitmentCount(consentContractAddress),
    ).thenReturn(okAsync(1));
    td.when(
      this.consentContractRepo.getAnonymitySet(consentContractAddress, 0, 1),
    ).thenReturn(okAsync([commitment1]));

    // TimeUtils ------------------------------------------------------
    td.when(this.timeUtils.getUnixNow()).thenReturn(now as never);

    // QueryParsingEngine
    td.when(
      this.queryParsingEngine.handleQuery(sdqlQuery, dataPermissions),
    ).thenReturn(okAsync(queryDeliveryItems));

    td.when(
      this.queryParsingEngine.handleQuery(sdqlQuery2, dataPermissions),
    ).thenReturn(okAsync(queryDeliveryItems));

    td.when(
      this.queryParsingEngine.handleQuery(sdqlQuery3, dataPermissions),
    ).thenReturn(okAsync(queryDeliveryItems));

    td.when(this.queryParsingEngine.parseQuery(sdqlQuery)).thenReturn(
      okAsync(avalanche1AstInstance),
    );

    // AccountRepo
    td.when(this.accountRepo.addEarnedRewards(earnedRewards)).thenReturn(
      okAsync(undefined),
    );
  }
  public factory(): QueryService {
    return new QueryService(
      this.dataWalletUtils,
      this.queryParsingEngine,
      this.sdqlQueryRepo,
      this.insightPlatformRepo,
      this.consentContractRepo,
      this.contextProvider,
      this.configProvider,
      this.cryptoUtils,
      this.accountRepo,
      this.sdqlQueryWrapperFactory,
      this.logUtils,
      this.timeUtils,
    );
  }
}

describe("QueryService.initialize() tests", () => {
  test("initialize() works", async () => {
    // Arrange
    const mocks = new QueryServiceMocks();
    const queryService = mocks.factory();

    // Act
    const result = await queryService.initialize();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    mocks.contextProvider.assertEventCounts({});
  });
});

describe("QueryService.approveQuery() tests", () => {
  test("happy path", async () => {
    // Arrange
    const mocks = new QueryServiceMocks();
    const queryService = mocks.factory();

    // Act
    const result = await queryService.approveQuery(
      consentContractAddress,
      sdqlQuery,
      rewardParameters,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    mocks.contextProvider.assertEventCounts({
      onQueryStatusUpdated: 1,
    });
  });

  test("no query status found but works", async () => {
    // Arrange
    const mocks = new QueryServiceMocks();

    td.when(mocks.sdqlQueryRepo.getQueryStatusByQueryCID(queryCID1)).thenReturn(
      okAsync(null),
    );

    td.when(
      mocks.sdqlQueryRepo.upsertQueryStatus([
        td.matchers.contains(
          new QueryStatus(
            consentContractAddress,
            queryCID1,
            BlockNumber(1),
            EQueryProcessingStatus.AdsCompleted,
            now,
            ObjectUtils.serialize(rewardParameters),
          ),
        ),
      ]),
    ).thenReturn(okAsync(undefined));

    const queryService = mocks.factory();

    // Act
    const result = await queryService.approveQuery(
      consentContractAddress,
      sdqlQuery,
      rewardParameters,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    mocks.contextProvider.assertEventCounts({
      onQueryStatusUpdated: 1,
    });

    // const res = result._unsafeUnwrap();
    // expect(err).toBeInstanceOf(AjaxError);
  });

  test("getQueryStatusByQueryCID fails", async () => {
    // Arrange
    const mocks = new QueryServiceMocks();

    const err = new PersistenceError(`PersistenceError`);
    td.when(mocks.sdqlQueryRepo.getQueryStatusByQueryCID(queryCID1)).thenReturn(
      errAsync(err),
    );
    const queryService = mocks.factory();

    // Act
    const result = await queryService.approveQuery(
      consentContractAddress,
      sdqlQuery,
      rewardParameters,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    mocks.contextProvider.assertEventCounts({});

    const res = result._unsafeUnwrapErr();
    expect(res).toBe(err);
  });

  test("upsertQueryStatus fails", async () => {
    // Arrange
    const mocks = new QueryServiceMocks();

    const err = new PersistenceError(`PersistenceError`);
    td.when(
      mocks.sdqlQueryRepo.upsertQueryStatus(td.matchers.anything()),
    ).thenReturn(errAsync(err));

    const queryService = mocks.factory();

    // Act
    const result = await queryService.approveQuery(
      consentContractAddress,
      sdqlQuery,
      rewardParameters,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    mocks.contextProvider.assertEventCounts({});

    const res = result._unsafeUnwrapErr();
    expect(res).toBe(err);
  });
});

describe("QueryService.returnQueries() tests", () => {
  test("happy path", async () => {
    // Arrange
    const mocks = new QueryServiceMocks();
    const queryService = mocks.factory();

    // Act
    const result = await queryService.returnQueries();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    mocks.contextProvider.assertEventCounts({ onQueryStatusUpdated: 1 });
  });

  test("No stored reward parameters", async () => {
    // Arrange
    const mocks = new QueryServiceMocks();

    const queryStatus = new QueryStatus(
      consentContractAddress,
      queryCID2,
      BlockNumber(123),
      EQueryProcessingStatus.AdsCompleted,
      then,
      null,
    );
    td.when(
      mocks.sdqlQueryRepo.getQueryStatusByStatus(
        EQueryProcessingStatus.AdsCompleted,
      ),
    ).thenReturn(okAsync([queryStatus]));

    td.when(
      mocks.sdqlQueryRepo.upsertQueryStatus([
        td.matchers.contains(
          new QueryStatus(
            queryStatus.consentContractAddress,
            queryStatus.queryCID,
            queryStatus.receivedBlock,
            EQueryProcessingStatus.NoRewardsParams,
            queryStatus.expirationDate,
            null,
          ),
        ),
      ]),
    ).thenReturn(okAsync(undefined));

    const queryService = mocks.factory();

    // Act
    const result = await queryService.returnQueries();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    mocks.contextProvider.assertEventCounts({
      onQueryParametersRequired: 1,
      onQueryStatusUpdated: 1,
    });
  });
});

describe("getPossibleInsightAndAdKeys tests", () => {
  test("get possible insights and ad keys", async () => {
    const mocks = new QueryServiceMocks();
    const queryService = mocks.factory(); // new context
    td.when(mocks.sdqlQueryRepo.getSDQLQueryByCID(queryCID1)).thenReturn(
      okAsync(sdqlQuery),
    ); // QQ: MAKES A LOT OF SENSE
    td.when(
      mocks.consentContractRepo.getCommitmentIndex(td.matchers.anything()),
    ).thenReturn(okAsync(1));

    await ResultUtils.combine([
      mocks.sdqlQueryRepo.getSDQLQueryByCID(queryCID1),
      mocks.contextProvider.getContext(),
      mocks.configProvider.getConfig(),
      //QQ: We just mocked sdqlQueryRepo.getByCID(queryId).
      // What's the point of checking if it's not null here?
    ]).andThen(([query, context, config]) => {
      if (query == null) {
        return errAsync(
          new IPFSError(`CID ${queryCID1} is not yet visible on IPFS`),
        );
      }
      //QQ: We just mocked context
      // What's the point of checking if DW address is null here?
      if (context.dataWalletAddress == null) {
        // Need to wait for the wallet to initialize
        return okAsync(undefined);
      }
      // We have the query, next step is check if you actually have a consent token for this business
      return mocks.consentContractRepo
        .getCommitmentIndex(consentContractAddress)
        .andThen((commitmentIndex) => {
          return okAsync(null);
        })
        .andThen(() => {
          const queryRequest = new SDQLQueryRequest(
            consentContractAddress,
            query,
            [],
            [],
            null,
          );

          context.publicEvents.onQueryPosted.next(queryRequest);
          return okAsync(undefined);
        })
        .mapErr((err) => {
          expect(err.constructor).toBe(UninitializedError);
          return err;
        });
    });
  });
});
