import "reflect-metadata";

import { TimeUtils } from "@snickerdoodlelabs/common-utils";
import {
  Age,
  CountryCode,
  DataPermissions,
  ERewardType,
  EvaluationError,
  ExpectedReward,
  Gender,
  HexString32,
  IDataWalletPersistence,
  IpfsCID,
  QueryExpiredError,
  QueryFormatError,
  QueryIdentifier,
  SDQLQuery,
  SDQLString,
  URLString,
  IChainTransaction,
  SDQL_Return,
  ChainId,
} from "@snickerdoodlelabs/objects";
import {
  avalanche1ExpiredSchemaStr,
  avalanche2SchemaStr,
  avalanche4SchemaStr,
  IQueryObjectFactory,
  ISDQLQueryWrapperFactory,
  QueryObjectFactory,
  SDQLQueryWrapperFactory,
  AST,
  ISDQLParserFactory,
  SDQLParserFactory,
  SDQLQueryUtils,
} from "@snickerdoodlelabs/query-parser";
import { errAsync, okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import * as td from "testdouble";
import { BaseOf } from "ts-brand";

import {
  QueryEvaluator,
  QueryParsingEngine,
  QueryRepository,
} from "@core/implementations/business";
import { BalanceQueryEvaluator } from "@core/implementations/business/utilities/query/BalanceQueryEvaluator";
import { NetworkQueryEvaluator } from "@core/implementations/business/utilities/query/NetworkQueryEvaluator";
import { QueryFactories } from "@core/implementations/utilities/factory";
import { IQueryFactories } from "@core/interfaces/utilities/factory";

const queryId = IpfsCID("Beep");
const sdqlQueryExpired = new SDQLQuery(
  queryId,
  SDQLString(avalanche1ExpiredSchemaStr),
);
const sdqlQuery = new SDQLQuery(queryId, SDQLString(avalanche2SchemaStr));
const sdqlQuery4 = new SDQLQuery(queryId, SDQLString(avalanche4SchemaStr));

const country = CountryCode("1");
const allPermissions = HexString32(
  "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
);
const noPermissions = HexString32(
  "0x0000000000000000000000000000000000000000000000000000000000000000",
);


class SDQLQueryUtilsMocks {
    
  protected parserFactory:ISDQLParserFactory;
  readonly queryWrapperFactory = new SDQLQueryWrapperFactory(new TimeUtils());
  readonly queryObjectFactory = new QueryObjectFactory();

  constructor() {
      this.parserFactory = new SDQLParserFactory(this.queryObjectFactory, this.queryWrapperFactory);
  }

  public factory(): SDQLQueryUtils {
      return new SDQLQueryUtils(
          this.parserFactory,
          this.queryWrapperFactory
      );
  }
}

class QueryParsingMocks {
  public persistenceRepo = td.object<IDataWalletPersistence>();
  public balanceQueryEvaluator = new BalanceQueryEvaluator(
    this.persistenceRepo,
  );
  public networkQueryEvaluator = new NetworkQueryEvaluator(
    this.persistenceRepo,
  );

  public queryUtilsMock = new SDQLQueryUtilsMocks();
  public queryUtils = this.queryUtilsMock.factory();

  public queryObjectFactory: IQueryObjectFactory;
  public queryFactories: IQueryFactories;
  public queryWrapperFactory: ISDQLQueryWrapperFactory;
  public queryRepository: QueryRepository;
  public queryEvaluator: QueryEvaluator;

  public constructor() {
    this.queryObjectFactory = new QueryObjectFactory();
    this.queryWrapperFactory = new SDQLQueryWrapperFactory(new TimeUtils());
    this.queryFactories = new QueryFactories(
      this.queryObjectFactory,
      this.queryWrapperFactory,
    );

    td.when(this.persistenceRepo.getGender()).thenReturn(
      okAsync(Gender("female")),
    );
    td.when(this.persistenceRepo.getAge()).thenReturn(okAsync(Age(25)));
    td.when(this.persistenceRepo.getLocation()).thenReturn(okAsync(country));

    td.when(this.persistenceRepo.getSiteVisitsMap()).thenReturn(
      okAsync(new Map()),
    );

    td.when(
      this.persistenceRepo.getEVMTransactions(td.matchers.anything()),
    ).thenReturn(okAsync([]));

    td.when(this.persistenceRepo.getTransactionsArray()).thenReturn(
      okAsync(new Array<IChainTransaction>()),
    );

    td.when(this.persistenceRepo.getAccountBalances()).thenReturn(okAsync([]));

    this.queryEvaluator = new QueryEvaluator(
      this.persistenceRepo,
      this.balanceQueryEvaluator,
      this.networkQueryEvaluator,
    );
    this.queryRepository = new QueryRepository(this.queryEvaluator);
  }

  public factory() {
    return new QueryParsingEngine(this.queryFactories, this.queryRepository, this.queryUtils);
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

    // Return to later - Andrew
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
  test("No null insight with all permissions given", async () => {
    const engine = mocks.factory();

    await engine
      .handleQuery(sdqlQuery, new DataPermissions(allPermissions))
      .andThen(([insights, rewards]) => {
        // console.log(insights);
        console.log("Insights: ", insights);
        console.log("Rewards: ", rewards);

        expect(insights).toEqual([
          "not qualified", // as network query is false
          country,
          "female",
          "{}",
        ]);
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

describe("Reward Preview", () => {
  // test("showcase rewards", async () => {
  //   const mocks = new QueryParsingMocks();
  //   const engine = mocks.factory();
  //   let val = await engine.getPreviews(sdqlQuery4, new DataPermissions(allPermissions))

  //   console.log("Output: ", val);
  // });

  // test("showcase rewards", async () => {
  //   const mocks = new QueryParsingMocks();
  //   const engine = mocks.factory();

  //   const schemaString = sdqlQuery4.query;
  //   const cid: IpfsCID = sdqlQuery4.cid;

  //   const response = await mocks.queryFactories
  //     .makeParserAsync(cid, schemaString)
  //     .andThen((sdqlParser) => {
  //       return sdqlParser.buildAST();
  //     })
  //     .andThen((ast: AST) => {
  //       const astEvaluator = mocks.queryFactories.makeAstEvaluator(
  //         cid,
  //         ast,
  //         mocks.queryRepository,
  //       );

  //       return engine.identifyQueries(
  //         ast,
  //         astEvaluator,
  //         new DataPermissions(allPermissions),
  //       );
  //     });

  //   console.log(response["value"]);
  //   //console.log("Output: ", response);
  // });

  // test("showcase rewards", async () => {
  //   const mocks = new QueryParsingMocks();
  //   const engine = mocks.factory();

  //   const schemaString = sdqlQuery4.query;
  //   const cid: IpfsCID = sdqlQuery4.cid;

  //   const response = await mocks.queryFactories
  //     .makeParserAsync(cid, schemaString)
  //     .andThen((sdqlParser) => {
  //       return sdqlParser.buildAST();
  //     })
  //     .andThen((ast: AST) => {
  //       const astEvaluator = mocks.queryFactories.makeAstEvaluator(
  //         cid,
  //         ast,
  //         mocks.queryRepository,
  //       );

  //       return engine.evalCompensations(
  //         ast,
  //         astEvaluator,
  //         new DataPermissions(allPermissions),
  //       );
  //     });

  //   console.log("Output: ", response["value"]);
  // });

  // test("showcase RewardsPreview", async () => {
  //   const mocks = new QueryParsingMocks();
  //   const engine = mocks.factory();

  //   const schemaString = sdqlQuery4.query;
  //   const cid: IpfsCID = sdqlQuery4.cid;

  //   const response = await mocks.queryFactories
  //     .makeParserAsync(cid, schemaString)
  //     .andThen((sdqlParser) => {
  //       return sdqlParser.buildAST();
  //     })
  //     .andThen((ast: AST) => {
  //       const astTree = ast;
  //       const astEvaluator = mocks.queryFactories.makeAstEvaluator(
  //         cid,
  //         ast,
  //         mocks.queryRepository,
  //       );

  //       return ResultUtils.combine([
  //         engine.identifyQueries(
  //           astTree,
  //           astEvaluator,
  //           new DataPermissions(allPermissions),
  //         ),
  //         engine.evalCompensations(
  //           astTree,
  //           astEvaluator,
  //           new DataPermissions(allPermissions),
  //         ),
  //       ]).andThen((results) => {
  //         const queries = results[0];
  //         const compensations = results[1];

  //         const queryIdentifiers = queries
  //           .map(mocks.SDQLReturnToQueryIdentifier)
  //           .filter((n) => n);
  //         const expectedRewards = compensations.filter((n) => n);

  //         const vals = expectedRewards.map(mocks.SDQLReturnToExpectedReward);

  //         console.log("QueryIdentifiers: ", queryIdentifiers.length);
  //         console.log("expectedRewards: ", vals.length);

  //         return okAsync<
  //           [QueryIdentifier[], ExpectedReward[]],
  //           EvaluationError | QueryFormatError | QueryExpiredError
  //         >([queryIdentifiers, vals]);
  //       });
  //     });

  //   console.log("Output: ", response["value"]);
  //   console.log("Queries: ", response["value"][0]);
  //   console.log("Expected Rewards: ", response["value"][1]);
  //   // console.log("Expected Rewards: ", response["value"][1].map((val) => val["description"]));
  //   // console.log("Expected Rewards: ", response["value"][1].map((val) => val["callback"]));
  // });
});
