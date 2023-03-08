import "reflect-metadata";

import {
  NftQueryEvaluator,
  QueryEvaluator,
  QueryParsingEngine,
  QueryRepository,
} from "@core/implementations/business";
import { BalanceQueryEvaluator } from "@core/implementations/business/utilities/query/BalanceQueryEvaluator";
import { BlockchainTransactionQueryEvaluator } from "@core/implementations/business/utilities/query/BlockchainTransactionQueryEvaluator";
import {
  AdContentRepository,
  AdDataRepository,
} from "@core/implementations/data";
import { QueryFactories } from "@core/implementations/utilities/factory";
import { SnickerdoodleCore } from "@core/index";
import {
  IBrowsingDataRepository,
  IDataWalletPersistence,
  IDemographicDataRepository,
  IPortfolioBalanceRepository,
  ITransactionHistoryRepository,
} from "@core/interfaces/data/index.js";
import { IQueryFactories } from "@core/interfaces/utilities/factory";
import { AjaxUtilsMock, ConfigProviderMock } from "@core-tests/mock/utilities";
import { TimeUtils } from "@snickerdoodlelabs/common-utils";
import {
  Age,
  ChainId,
  CompensationId,
  CountryCode,
  DataPermissions,
  ERewardType,
  ExpectedReward,
  Gender,
  HexString32,
  IpfsCID,
  ISDQLCompensations,
  QueryIdentifier,
  SDQLQuery,
  SDQLString,
  SDQL_Return,
  TransactionPaymentCounter,
} from "@snickerdoodlelabs/objects";
import {
  avalanche1ExpiredSchemaStr,
  avalanche2SchemaStr,
  avalanche4SchemaStr,
  IQueryObjectFactory,
  ISDQLQueryUtils,
  ISDQLQueryWrapperFactory,
  QueryObjectFactory,
  SDQLQueryWrapperFactory,
} from "@snickerdoodlelabs/query-parser";
import { okAsync } from "neverthrow";
import * as td from "testdouble";
import { BaseOf } from "ts-brand";

const queryCID = IpfsCID("Beep");
const sdqlQueryExpired = new SDQLQuery(
  queryCID,
  SDQLString(avalanche1ExpiredSchemaStr),
);
const sdqlQuery = new SDQLQuery(queryCID, SDQLString(avalanche2SchemaStr));
const sdqlQuery4 = new SDQLQuery(queryCID, SDQLString(avalanche4SchemaStr));

const country = CountryCode("1");
const allPermissions = HexString32(
  "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
);
const noPermissions = HexString32(
  "0x0000000000000000000000000000000000000000000000000000000000000000",
);

class QueryParsingMocks {
  public persistenceRepo = td.object<IDataWalletPersistence>();
  public transactionRepo = td.object<ITransactionHistoryRepository>();
  public balanceRepo = td.object<IPortfolioBalanceRepository>();
  public demoDataRepo = td.object<IDemographicDataRepository>();
  public browsingDataRepo = td.object<IBrowsingDataRepository>();
  public adDataRepo = td.object<AdDataRepository>();

  public blockchainTransactionQueryEvaluator =
    new BlockchainTransactionQueryEvaluator(this.transactionRepo);

  public nftQueryEvaluator = new NftQueryEvaluator(this.balanceRepo);

  public balanceQueryEvaluator = new BalanceQueryEvaluator(this.balanceRepo);

  public queryUtils = td.object<ISDQLQueryUtils>();

  public queryObjectFactory: IQueryObjectFactory;
  public queryFactories: IQueryFactories;
  public queryWrapperFactory: ISDQLQueryWrapperFactory;
  public queryRepository: QueryRepository;
  public queryEvaluator: QueryEvaluator;

  public adContentRepository: AdContentRepository;

  public snickerDoodleCore: SnickerdoodleCore;

  public constructor() {
    this.queryObjectFactory = new QueryObjectFactory();
    this.queryWrapperFactory = new SDQLQueryWrapperFactory(new TimeUtils());
    this.snickerDoodleCore = new SnickerdoodleCore(
      undefined,
      undefined,
      td.object(),
    );
    this.queryFactories = new QueryFactories(
      this.queryObjectFactory,
      this.queryWrapperFactory,
    );

    const expectedCompensationsMap = new Map<
      CompensationId,
      ISDQLCompensations
    >();
    expectedCompensationsMap
      .set(CompensationId("c1"), {
        description: "Only the chainId is compared, so this can be random.",
        chainId: ChainId(1),
      } as ISDQLCompensations)
      .set(CompensationId("c2"), {
        description: "Only the chainId is compared, so this can be random.",
        chainId: ChainId(1),
      } as ISDQLCompensations)
      .set(CompensationId("c3"), {
        description: "Only the chainId is compared, so this can be random.",
        chainId: ChainId(1),
      } as ISDQLCompensations);

    this.queryEvaluator = new QueryEvaluator(
      this.balanceQueryEvaluator,
      this.blockchainTransactionQueryEvaluator,
      this.nftQueryEvaluator,
      this.snickerDoodleCore,
      this.demoDataRepo,
      this.browsingDataRepo,
      this.transactionRepo,
    );
    this.queryRepository = new QueryRepository(this.queryEvaluator);
    this.adContentRepository = new AdContentRepository(
      new AjaxUtilsMock(),
      new ConfigProviderMock(),
    );

    td.when(this.demoDataRepo.getGender()).thenReturn(
      okAsync(Gender("female")),
    );
    // td.when(this.snickerDoodleCore.getAge()).thenReturn(okAsync(Age(10)));
    td.when(this.demoDataRepo.getAge()).thenReturn(okAsync(Age(10)));
    td.when(this.demoDataRepo.getLocation()).thenReturn(okAsync(country));
    td.when(this.browsingDataRepo.getSiteVisitsMap()).thenReturn(
      okAsync(new Map()),
    );
    td.when(
      this.transactionRepo.getTransactions(td.matchers.anything()),
    ).thenReturn(okAsync([]));
    td.when(this.transactionRepo.getTransactionValueByChain()).thenReturn(
      okAsync(new Array<TransactionPaymentCounter>()),
    );
    td.when(this.balanceRepo.getAccountBalances()).thenReturn(okAsync([]));

    td.when(
      this.queryUtils.getPermittedQueryIds(
        td.matchers.anything(),
        new DataPermissions(allPermissions),
      ),
    ).thenReturn(okAsync([] as QueryIdentifier[]));
  }

  public factory() {
    return new QueryParsingEngine(
      this.queryFactories,
      this.queryRepository,
      this.queryUtils,
      this.adContentRepository,
      this.adDataRepo,
    );
  }

  public SDQLReturnToQueryIdentifier(sdqlR: SDQL_Return): QueryIdentifier {
    const actualTypeData = sdqlR as BaseOf<SDQL_Return>;
    if (typeof actualTypeData == "string") {
      return QueryIdentifier(actualTypeData);
    } else if (actualTypeData == null) {
      return QueryIdentifier("");
    } else {
      return QueryIdentifier(JSON.stringify(actualTypeData));
    }
  }

  // TODO: Add Lazy and Web2 Reward Implementation
  public SDQLReturnToExpectedReward(sdqlR: SDQL_Return): ExpectedReward {
    const actualTypeData = sdqlR as BaseOf<SDQL_Return>;

    if (typeof actualTypeData == "object") {
      if (actualTypeData != null) {
        console.log("rewardData: ", JSON.stringify(actualTypeData));
        console.log(
          "rewardData['description']: ",
          actualTypeData["description"],
        );
        console.log("rewardData['callback']: ", actualTypeData["callback"]);
        console.log(
          "rewardData['callback']['parameters']: ",
          actualTypeData["callback"]["parameters"],
        );
        console.log(
          "rewardData['callback']['data']: ",
          actualTypeData["callback"]["data"],
        );
        return new ExpectedReward(
          actualTypeData["compensationKey"],
          actualTypeData["description"],
          ChainId(actualTypeData["chainId"]),
          actualTypeData["callback"],
          ERewardType.Direct,
        );
      }
    }
    if (typeof actualTypeData == "string") {
      const rewardData = JSON.parse(actualTypeData);
      console.log("rewardData: ", rewardData);
      console.log("rewardData['description']: ", rewardData["description"]);
      console.log("rewardData['callback']: ", rewardData["callback"]);
      console.log(
        "rewardData['callback']['parameters']: ",
        rewardData["callback"]["parameters"],
      );
      console.log(
        "rewardData['callback']['data']: ",
        rewardData["callback"]["data"],
      );
      return new ExpectedReward(
        rewardData["compensationKey"],
        rewardData["description"],
        ChainId(rewardData["chainId"]),
        rewardData["callback"],
        ERewardType.Direct,
      );
    }

    return new ExpectedReward("", "", ChainId(0), "", ERewardType.Direct);
  }
}

/*
describe("single Tests", () => {
  test("Expired query must return QueryExpiredError", async () => {
    const mocks = new QueryParsingMocks();
    const engine = mocks.factory();

    await engine
      .handleQuery(sdqlQueryExpired, new DataPermissions(allPermissions))
      .andThen(([insights, rewards]) => {
        fail("Expired query was executed!");
        return errAsync(new Error(`Expired query was executed!`));
      })
      .mapErr((err) => {
        expect(err.constructor).toBe(QueryExpiredError);
      });
  });
});
*/

describe("Testing order of results", () => {
  const mocks = new QueryParsingMocks();
  const engine = mocks.factory();

  test("No null insight with all permissions given", async () => {
    await engine
      .handleQuery(sdqlQuery, new DataPermissions(allPermissions))
      .andThen(([insights, rewards]) => {
        console.log("Insights: ", insights);
        console.log("Rewards: ", rewards);
        expect(insights.returns).toEqual({
          "if($q1and$q2)then$r1else$r2": "not qualified",
          $r3: country,
          $r4: "female",
          $r5: "{}",
        });
        return okAsync(insights);
      })
      .mapErr((e) => {
        console.log(e);
        fail(e.message);
      });
  });
});

/*
describe("Tests with data permissions", () => {
  const mocks = new QueryParsingMocks();
  const engine = mocks.factory();

  test("avalanche 2 first insight is null when age permission is not given", async () => {
    const flags = EWalletDataType.EVMTransactions;
    const givenPermissions = new DataPermissions(noPermissions);

    await engine
      .handleQuery(sdqlQuery, givenPermissions)
      .andThen(([insights, rewards]) => {
        // console.log(insights);
        console.log("Insights: ", insights);
        console.log("Rewards: ", rewards);
        expect(insights[0]).toBe("");
        return okAsync(undefined);
      })
      .mapErr((e) => {
        console.log(e);
        fail(e.message);
      });
  });

  test("avalanche 2 first insight is null when network permission is not given", async () => {
    const givenPermissions = DataPermissions.createWithPermissions([
      EWalletDataType.Age,
    ]);

    await engine
      .handleQuery(sdqlQuery, givenPermissions)
      .andThen(([insights, rewards]) => {
        // console.log(insights);
        console.log("Insights: ", insights);
        console.log("Rewards: ", rewards);
        expect(insights[0]).toBe("");
        return okAsync(undefined);
      })
      .mapErr((e) => {
        console.log(e);
        fail(e.message);
      });
  });

  test("avalanche 2 first insight is not null when network and age permissions are given", async () => {
    const givenPermissions = DataPermissions.createWithPermissions([
      EWalletDataType.Age,
      EWalletDataType.EVMTransactions,
    ]);

    await engine
      .handleQuery(sdqlQuery, givenPermissions)
      .andThen(([insights, rewards]) => {
        // console.log(insights);
        console.log("Insights: ", insights);
        console.log("Rewards: ", rewards);
        expect(insights[0] !== "").toBeTruthy();
        return okAsync(undefined);
      })
      .mapErr((e) => {
        console.log(e);
        fail(e.message);
      });
  });

  test("all null when no permissions are given", async () => {
    const givenPermissions = new DataPermissions(noPermissions);

    await engine
      .handleQuery(sdqlQuery, givenPermissions)
      .andThen(([insights, rewards]) => {
        // console.log(insights);
        console.log("Insights: ", insights);
        console.log("Rewards: ", rewards);
        expect(insights).toEqual(["", "", "", ""]);
        return okAsync(undefined);
      })
      .mapErr((e) => {
        console.log(e);
        fail(e.message);
      });
  });

  test("avalanche 2 4th insight not null when siteVisits given", async () => {
    const givenPermissions = DataPermissions.createWithPermissions([
      EWalletDataType.SiteVisits,
    ]);

    await engine
      .handleQuery(sdqlQuery, givenPermissions)
      .andThen(([insights, rewards]) => {
        // console.log(insighyarts);
        console.log("Insights: ", insights);
        console.log("Rewards: ", rewards);
        expect(insights[3] !== "").toBeTruthy();
        return okAsync(undefined);
      })
      .mapErr((e) => {
        console.log(e);
        fail(e.message);
      });
  });
});

describe("Testing avalanche 4", () => {
  test("avalanche 4", async () => {
    const mocks = new QueryParsingMocks();
    const engine = mocks.factory();

    const expectedInsights = [
      "not qualified",
      "1",
      "female",
      "{}",
      "[]",
      "[]",
      "[]",
    ]; // 7 return expressions

    // console.log(sdqlQuery4);

    await engine
      .handleQuery(sdqlQuery4, new DataPermissions(allPermissions))
      .andThen(([insights, rewards]) => {
        // console.log("Why not printed")

        // console.log('insights', insights);
        expect(insights).toEqual(expectedInsights);
        expect(insights.length > 0).toBeTruthy();
        console.log("Insights: ", insights);
        console.log("Rewards: ", rewards);

        return okAsync(undefined);
      })
      .mapErr((e) => {
        console.log(e);
        fail(e.message);
      });
  });
});
*/
