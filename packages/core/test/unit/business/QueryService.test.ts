import {
  ILogUtils,
  ITimeUtils,
  ObjectUtils,
} from "@snickerdoodlelabs/common-utils";
import { IInsightPlatformRepository } from "@snickerdoodlelabs/insight-platform-api";
import { ICryptoUtils } from "@snickerdoodlelabs/node-utils";
import {
  BlockNumber,
  ConsentToken,
  DataPermissions,
  EQueryProcessingStatus,
  ERewardType,
  EVMAccountAddress,
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
  JSONString,
  InvalidStatusError,
  InvalidParametersError,
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
import {
  IConsentTokenUtils,
  IQueryParsingEngine,
} from "@core/interfaces/business/utilities/index.js";
import {
  IConsentContractRepository,
  IInvitationRepository,
  ILinkedAccountRepository,
  IQuestionnaireRepository,
  ISDQLQueryRepository,
} from "@core/interfaces/data/index.js";
import {
  IConfigProvider,
  IDataWalletUtils,
} from "@core/interfaces/utilities/index.js";
import {
  avalanche1AstInstance,
  dataWalletAddress,
  dataWalletKey,
  defaultInsightPlatformBaseUrl,
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

const dataPermissions = DataPermissions.createWithAllPermissions();

const rewardParameter = {
  recipientAddress: {
    type: ESolidityAbiParameterType.address,
    value: "0xb794f5ea0ba39494ce839613fffba74279579268",
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
  JSONString("{}"),
  "Offer",
  "",
  1,
  [],
  [],
  null,
);

const adsCompletedQueryStatus = new QueryStatus(
  consentContractAddress,
  queryCID2,
  BlockNumber(123),
  EQueryProcessingStatus.AdsCompleted,
  then,
  ObjectUtils.serialize(rewardParameters),
  "Offer",
  "",
  1,
  [],
  [],
  null,
);

const earnedReward = new EarnedReward(
  queryCID1,
  "rewardName",
  null,
  "description",
  ERewardType.Direct,
);

const earnedRewards = [earnedReward];

class QueryServiceMocks {
  public consentTokenUtils: IConsentTokenUtils;
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
  public invitationRepo: IInvitationRepository;

  public consentToken = new ConsentToken(
    consentContractAddress,
    EVMAccountAddress(dataWalletAddress),
    tokenId,
    dataPermissions,
  );

  public constructor() {
    this.consentTokenUtils = td.object<IConsentTokenUtils>();
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
    this.invitationRepo = td.object<IInvitationRepository>();

    td.when(
      this.insightPlatformRepo.deliverInsights(
        consentContractAddress,
        tokenId,
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
        derivedPrivateKey,
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
      this.sdqlQueryRepo.getQueryStatus(EQueryProcessingStatus.Received),
    ).thenReturn(okAsync([receivedQueryStatus]));
    td.when(
      this.sdqlQueryRepo.getQueryStatus(EQueryProcessingStatus.AdsCompleted),
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
            "Offer",
            "",
            1,
            [],
            [],
            null,
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
            "Offer",
            "",
            1,
            [],
            [],
            null,
          ),
        ),
      ]),
    ).thenReturn(okAsync(undefined));

    // ConsentContractRepository ---------------------------------------------
    td.when(
      this.consentContractRepo.isAddressOptedIn(consentContractAddress),
    ).thenReturn(okAsync(true));
    td.when(
      this.consentTokenUtils.getCurrentConsentToken(consentContractAddress),
    ).thenReturn(okAsync(this.consentToken));

    td.when(
      this.dataWalletUtils.deriveOptInPrivateKey(
        consentContractAddress,
        dataWalletKey,
      ),
    ).thenReturn(okAsync(derivedPrivateKey));

    // TimeUtils ------------------------------------------------------
    td.when(this.timeUtils.getUnixNow()).thenReturn(now as never);

    // QueryParsingEngine
    td.when(
      this.queryParsingEngine.handleQuery(
        sdqlQuery,
        this.consentToken.dataPermissions,
      ),
    ).thenReturn(okAsync(queryDeliveryItems));

    td.when(
      this.queryParsingEngine.handleQuery(
        sdqlQuery2,
        this.consentToken.dataPermissions,
      ),
    ).thenReturn(okAsync(queryDeliveryItems));

    td.when(
      this.queryParsingEngine.handleQuery(
        sdqlQuery3,
        this.consentToken.dataPermissions,
      ),
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
      this.consentTokenUtils,
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
      this.invitationRepo,
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
      sdqlQuery.cid,
      rewardParameters,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    mocks.contextProvider.assertEventCounts({
      onQueryStatusUpdated: 1,
    });
  });

  test("no query status found, rejected with UninitializedError", async () => {
    // Arrange
    const mocks = new QueryServiceMocks();

    td.when(mocks.sdqlQueryRepo.getQueryStatusByQueryCID(queryCID1)).thenReturn(
      okAsync(null),
    );

    const queryService = mocks.factory();

    // Act
    const result = await queryService.approveQuery(
      sdqlQuery.cid,
      rewardParameters,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const res = result._unsafeUnwrapErr();
    expect(res).toBeInstanceOf(UninitializedError);

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
      sdqlQuery.cid,
      rewardParameters,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    mocks.contextProvider.assertEventCounts({});

    const res = result._unsafeUnwrapErr();
    expect(res).toBe(err);
  });

  test("upsertQueryStatus fails, query is already AdsCompleted can not approve", async () => {
    // Arrange
    const mocks = new QueryServiceMocks();

    const queryService = mocks.factory();

    // Act
    const result = await queryService.approveQuery(
      sdqlQuery.cid,
      rewardParameters,
    );
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const res = result._unsafeUnwrapErr();
    expect(res).toBeInstanceOf(InvalidStatusError);
  });

  test("upsertQueryStatus fails, invalid address supplied with reward params", async () => {
    // Arrange
    const mocks = new QueryServiceMocks();

    const invalidRewardParameter = {
      recipientAddress: {
        type: ESolidityAbiParameterType.address,
        value: "Phoebe",
      },
      compensationKey: {
        type: ESolidityAbiParameterType.string,
        value: "c1",
      },
    } as IDynamicRewardParameter;

    const queryService = mocks.factory();

    // Act
    const result = await queryService.approveQuery(sdqlQuery.cid, [
      invalidRewardParameter,
    ]);
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const res = result._unsafeUnwrapErr();
    expect(res).toBeInstanceOf(InvalidParametersError);
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
  //only
  test("Empty reward parameters", async () => {
    // Arrange
    const mocks = new QueryServiceMocks();

    const queryStatus = new QueryStatus(
      consentContractAddress,
      queryCID2,
      BlockNumber(123),
      EQueryProcessingStatus.AdsCompleted,
      then,
      JSONString("{}"),
      "Offer",
      "",
      1,
      [],
      [],
      null,
    );
    td.when(
      mocks.sdqlQueryRepo.getQueryStatus(EQueryProcessingStatus.AdsCompleted),
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
            JSONString("{}"),
            "Offer",
            "",
            1,
            [],
            [],
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

describe("getPossibleInisightAndAdKeys tests", () => {
  test("get possbile insights and ad keys", async () => {
    const mocks = new QueryServiceMocks();
    const queryService = mocks.factory(); // new context
    td.when(mocks.sdqlQueryRepo.getSDQLQueryByCID(queryCID1)).thenReturn(
      okAsync(sdqlQuery),
    ); // QQ: MAKES A LOT OF SENSE
    td.when(
      mocks.consentContractRepo.isAddressOptedIn(td.matchers.anything()),
    ).thenReturn(okAsync(true));

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
        .isAddressOptedIn(consentContractAddress)
        .andThen((addressOptedIn) => {
          return okAsync(null);
        })
        .andThen(() => {
          const queryRequest = new SDQLQueryRequest(
            consentContractAddress,
            query.cid,
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
