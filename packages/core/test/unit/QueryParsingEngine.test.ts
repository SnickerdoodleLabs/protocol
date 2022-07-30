import "reflect-metadata";
import {
  Age,
  CountryCodeLetter,
  CountryCodeNumber,
  IDataWalletPersistence,
  IpfsCID,
  SDQLQuery,
  SDQLString,
} from "@snickerdoodlelabs/objects";
import { okAsync } from "neverthrow";
import td from "testdouble";

import { avalance1SchemaStr } from "./business/query/avalanche1.data";

import {
  QueryEvaluator,
  QueryParsingEngine,
  QueryRepository,
} from "@core/implementations/business";
import { QueryFactories } from "@core/implementations/utilities/factory";
import { IQueryFactories } from "@core/interfaces/utilities/factory";

const queryId = IpfsCID("Beep");
const sdqlQuery = new SDQLQuery(queryId, SDQLString(avalance1SchemaStr));
const country = CountryCodeLetter("1");

class QueryParsingMocks {
  public persistenceRepo = td.object<IDataWalletPersistence>();
  protected queryFactories: IQueryFactories;
  //   protected queryRepository = td.object<IQueryRepository>();
  protected queryRepository: QueryRepository;
  protected queryEvaluator: QueryEvaluator;

  public constructor() {
    this.queryFactories = new QueryFactories();

    td.when(this.persistenceRepo.getAge()).thenReturn(okAsync(Age(25)));
    td.when(this.persistenceRepo.getLocation()).thenReturn(okAsync(country));

    this.queryEvaluator = new QueryEvaluator(this.persistenceRepo);
    this.queryRepository = new QueryRepository(this.queryEvaluator);
  }

  public factory() {
    return new QueryParsingEngine(this.queryFactories, this.queryRepository);
  }
}

describe("Testing order of results", () => {
  const mocks = new QueryParsingMocks();
  test("avalance 1 logics", async () => {
    const engine = mocks.factory();

    await engine.handleQuery(sdqlQuery).andThen(([insights, rewards]) => {
      // console.log(insights);
      // return okAsync(0);
      expect(insights).toEqual(["qualified", country]);
      return okAsync(insights);
    });
  });
});
