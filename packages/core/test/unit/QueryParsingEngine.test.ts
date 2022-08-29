import "reflect-metadata";
import {
  Age,
  CountryCode,
  DataPermissions,
  EWalletDataType,
  Gender,
  IDataWalletPersistence,
  IpfsCID,
  SDQLQuery,
  SDQLString,
} from "@snickerdoodlelabs/objects";
import { okAsync } from "neverthrow";
import td from "testdouble";

import {
  QueryEvaluator,
  QueryObjectFactory,
  QueryParsingEngine,
  QueryRepository,
} from "@core/implementations/business";
import { QueryFactories } from "@core/implementations/utilities/factory";
import { IQueryFactories } from "@core/interfaces/utilities/factory";
import { avalance2SchemaStr } from "./business/query/avalanche2.data";
import { IBalanceQueryEvaluator } from "@core/interfaces/business/utilities/query/IBalanceQueryEvaluator";
import { IQueryObjectFactory } from "@core/interfaces/utilities/factory/IQueryObjectFactory";

const queryId = IpfsCID("Beep");
const sdqlQuery = new SDQLQuery(queryId, SDQLString(avalance2SchemaStr));
const country = CountryCode("1");

class QueryParsingMocks {
  public persistenceRepo = td.object<IDataWalletPersistence>();
  public balanceQueryEvaluator = td.object<IBalanceQueryEvaluator>();

  protected queryObjectFactory: IQueryObjectFactory;
  protected queryFactories: IQueryFactories;
  //   protected queryRepository = td.object<IQueryRepository>();
  protected queryRepository: QueryRepository;
  protected queryEvaluator: QueryEvaluator;

  public constructor() {
    this.queryObjectFactory = new QueryObjectFactory();
    this.queryFactories = new QueryFactories(this.queryObjectFactory);

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

    this.queryEvaluator = new QueryEvaluator(this.persistenceRepo, this.balanceQueryEvaluator);
    this.queryRepository = new QueryRepository(this.queryEvaluator);
  }

  public factory() {
    return new QueryParsingEngine(this.queryFactories, this.queryRepository);
  }
}

describe.only("Testing order of results", () => {
  const mocks = new QueryParsingMocks();
  test("No null insight with all permissions given", async () => {
    const engine = mocks.factory();

    await engine
      .handleQuery(sdqlQuery, new DataPermissions(0xffffffff))
      .andThen(([insights, rewards]) => {
        console.log(insights);
        expect(insights).toEqual([
          "not qualified",
          country,
          "female",
          new Map(),
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

  test("avalance 2 first insight is null when age permission is not given", async () => {
    // const flags = EWalletDataType.Age | EWalletDataType.Gender | EWalletDataType.Location | EWalletDataType.SiteVisits | EWalletDataType.EVMTransactions;
    const flags = EWalletDataType.EVMTransactions;
    const givenPermissions = new DataPermissions(flags);

    await engine.handleQuery(sdqlQuery, givenPermissions)
      .andThen(([insights, rewards]) => {
        // console.log(insights);
        expect(insights[0]).toBeNull();
        return okAsync(undefined);
      })
      .mapErr((e) => {
        console.log(e);
        fail(e.message);
      });
  });

  test("avalance 2 first insight is null when network permission is not given", async () => {
    // const flags = EWalletDataType.Age | EWalletDataType.Gender | EWalletDataType.Location | EWalletDataType.SiteVisits | EWalletDataType.EVMTransactions;
    const flags = EWalletDataType.Age;
    const givenPermissions = new DataPermissions(flags);

    await engine.handleQuery(sdqlQuery, givenPermissions)
      .andThen(([insights, rewards]) => {
        // console.log(insights);
        expect(insights[0]).toBeNull();
        return okAsync(undefined);
      })
      .mapErr((e) => {
        console.log(e);
        fail(e.message);
      });
  });

  test("avalance 2 first insight is not null when network and age permissions are given", async () => {
    // const flags = EWalletDataType.Age | EWalletDataType.Gender | EWalletDataType.Location | EWalletDataType.SiteVisits | EWalletDataType.EVMTransactions;
    const flags = EWalletDataType.Age | EWalletDataType.EVMTransactions;
    const givenPermissions = new DataPermissions(flags);

    await engine.handleQuery(sdqlQuery, givenPermissions)
      .andThen(([insights, rewards]) => {
        // console.log(insights);
        expect(insights[0] !== null).toBeTruthy();
        return okAsync(undefined);
      })
      .mapErr((e) => {
        console.log(e);
        fail(e.message);
      });
  });

  test("all null when no permissions are given", async () => {
    // const flags = EWalletDataType.Age | EWalletDataType.Gender | EWalletDataType.Location | EWalletDataType.SiteVisits | EWalletDataType.EVMTransactions;
    const flags = 0;
    const givenPermissions = new DataPermissions(flags);

    await engine.handleQuery(sdqlQuery, givenPermissions)
      .andThen(([insights, rewards]) => {
        // console.log(insights);
        expect(insights).toEqual([null, null, null, null])
        return okAsync(undefined);
      })
      .mapErr((e) => {
        console.log(e);
        fail(e.message);
      });
  });

  test("avalance 2 4th insight not null when siteVisits given", async () => {
    // const flags = EWalletDataType.Age | EWalletDataType.Gender | EWalletDataType.Location | EWalletDataType.SiteVisits | EWalletDataType.EVMTransactions;
    const flags = EWalletDataType.SiteVisits;
    const givenPermissions = new DataPermissions(flags);

    await engine.handleQuery(sdqlQuery, givenPermissions)
      .andThen(([insights, rewards]) => {
        // console.log(insighyarts);
        expect(insights[3] !== null).toBeTruthy();
        return okAsync(undefined);
      })
      .mapErr((e) => {
        console.log(e);
        fail(e.message);
      });
  });
});
