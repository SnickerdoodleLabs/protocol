import "reflect-metadata";

import { TimeUtils } from "@snickerdoodlelabs/common-utils";
import {
  Age,
  ChainId,
  CountryCode,
  DataPermissions,
  EWalletDataType,
  Gender,
  HexString32,
  IDataWalletPersistence,
  IpfsCID,
  QueryExpiredError,
  SDQLQuery,
  SDQLString,
  IChainTransaction,
} from "@snickerdoodlelabs/objects";
import {
  avalanche1ExpiredSchemaStr,
  avalanche2SchemaStr,
  avalanche4SchemaStr,
  IQueryObjectFactory,
  ISDQLQueryWrapperFactory,
  QueryObjectFactory,
  SDQLQueryWrapperFactory,
} from "@snickerdoodlelabs/query-parser";
import { errAsync, okAsync } from "neverthrow";
import * as td from "testdouble";

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

class QueryParsingMocks {
  public persistenceRepo = td.object<IDataWalletPersistence>();
  public balanceQueryEvaluator = new BalanceQueryEvaluator(
    this.persistenceRepo,
  );
  public networkQueryEvaluator = new NetworkQueryEvaluator(
    this.persistenceRepo,
  );

  protected queryObjectFactory: IQueryObjectFactory;
  protected queryFactories: IQueryFactories;
  protected queryWrapperFactory: ISDQLQueryWrapperFactory;
  protected queryRepository: QueryRepository;
  protected queryEvaluator: QueryEvaluator;

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
      this.persistenceRepo.getTransactions(td.matchers.anything()),
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
    return new QueryParsingEngine(this.queryFactories, this.queryRepository);
  }
}

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

describe("Testing order of results", () => {
  const mocks = new QueryParsingMocks();
  test("No null insight with all permissions given", async () => {
    const engine = mocks.factory();

    await engine
      .handleQuery(sdqlQuery, new DataPermissions(allPermissions))
      .andThen(([insights, rewards]) => {
        // console.log(insights);
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

describe("Tests with data permissions", () => {
  const mocks = new QueryParsingMocks();
  const engine = mocks.factory();
  /**
   * Plan, create a data permission object
   */

  test("avalanche 2 first insight is null when age permission is not given", async () => {
    const flags = EWalletDataType.EVMTransactions;
    const givenPermissions = new DataPermissions(noPermissions);

    await engine
      .handleQuery(sdqlQuery, givenPermissions)
      .andThen(([insights, rewards]) => {
        // console.log(insights);
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
        return okAsync(undefined);
      })
      .mapErr((e) => {
        console.log(e);
        fail(e.message);
      });
  });
});
