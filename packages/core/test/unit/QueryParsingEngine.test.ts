import "reflect-metadata";
import {
  Age,
  CountryCode,
  DataPermissions,
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

describe("Testing order of results", () => {
  const mocks = new QueryParsingMocks();
  test("avalance 2 logics", async () => {
    const engine = mocks.factory();

    await engine
      .handleQuery(sdqlQuery, new DataPermissions(0xffffffff))
      .andThen(([insights, rewards]) => {
        console.log(insights);
        // return okAsync(0);
        // expect(insights).toEqual(["qualified", country]);
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
