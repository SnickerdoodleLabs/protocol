
import td from "testdouble";

import "reflect-metadata";
import { Age, CountryCode, IDataWalletPersistence, IpfsCID, SDQLQuery, SDQLString } from "@snickerdoodlelabs/objects";
import { IQueryRepository } from "@core/interfaces/business/utilities";
import { IQueryFactories } from "@core/interfaces/utilities/factory";
import { QueryFactories } from "@core/implementations/utilities/factory";
import { QueryEvaluator, QueryParsingEngine, QueryRepository } from "@core/implementations/business";
import { okAsync } from "neverthrow";
import { avalance1SchemaStr } from "./business/query/avalanche1.data";

const queryId = IpfsCID("Beep");
const sdqlQuery = new SDQLQuery(queryId, SDQLString(avalance1SchemaStr));

class QueryParsingMocks {
      public persistenceRepo = td.object<IDataWalletPersistence>();
      protected queryFactories: IQueryFactories;
    //   protected queryRepository = td.object<IQueryRepository>();
      protected queryRepository: QueryRepository;
      protected queryEvaluator: QueryEvaluator;

    public constructor() {

        this.queryFactories = new QueryFactories();

        td.when(this.persistenceRepo.getAge()).thenReturn(okAsync(Age(25)));
        td.when(this.persistenceRepo.getLocation()).thenReturn(okAsync(CountryCode(1)));

        this.queryEvaluator = new QueryEvaluator(this.persistenceRepo);
        this.queryRepository = new QueryRepository(this.queryEvaluator);

    }

    public factory() {
        return new QueryParsingEngine(
            this.queryFactories,
            this.queryRepository
        )
    }
}

describe("Testing order of results", () => {
    const mocks = new QueryParsingMocks();
    test("avalance 1 logics", () => {
        const engine = mocks.factory();

        engine.handleQuery(sdqlQuery).andThen(([insights, rewards]) => {

            console.log(insights);
            return okAsync(0);

        })
    });
});