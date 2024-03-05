import "reflect-metadata";

import {
  Age,
  ChainId,
  EVMAccountAddress,
  Gender,
  SDQL_Name,
  SDQL_OperatorName,
  URLString,
  BigNumberString,
  EVMTransaction,
  UnixTimestamp,
  EVMTransactionHash,
  TransactionPaymentCounter,
  ESDQLQueryReturn,
  IpfsCID,
  SiteVisitsData,
  SiteVisitsMap,
  ISO8601DateString,
  TransactionFlowInsight,
} from "@snickerdoodlelabs/objects";
import {
  AST_PropertyQuery,
  ConditionE,
  ConditionG,
  ConditionGE,
  ConditionL,
  ConditionLE,
} from "@snickerdoodlelabs/query-parser";
import { okAsync } from "neverthrow";
import * as td from "testdouble";

import { QueryEvaluator } from "@core/implementations/business/utilities/query/index.js";
import {
  IBalanceQueryEvaluator,
  IBlockchainTransactionQueryEvaluator,
  INftQueryEvaluator,
  IWeb3AccountQueryEvaluator,
} from "@core/interfaces/business/utilities/query/index.js";
import {
  IBrowsingDataRepository,
  ITransactionHistoryRepository,
  IDemographicDataRepository,
  ISocialRepository,
} from "@core/interfaces/data/index.js";
import { ContextProviderMock } from "@core-tests/mock/utilities";

const iso = UnixTimestamp(11);
const queryTimestamp = UnixTimestamp(1);
const conditionsGE = [new ConditionGE(SDQL_OperatorName("ge"), null, 20)];
const conditionsGE2 = [new ConditionGE(SDQL_OperatorName("ge"), null, 25)];
const conditionsGE3 = [new ConditionGE(SDQL_OperatorName("ge"), null, 30)];

const conditionsLE = [new ConditionLE(SDQL_OperatorName("le"), null, 20)];
const conditionsLE2 = [new ConditionLE(SDQL_OperatorName("le"), null, 25)];
const conditionsLE3 = [new ConditionLE(SDQL_OperatorName("le"), null, 30)];

const conditionsG = [new ConditionG(SDQL_OperatorName("g"), null, 24)];
const conditionsG2 = [new ConditionG(SDQL_OperatorName("g"), null, 25)];
const conditionsG3 = [new ConditionG(SDQL_OperatorName("g"), null, 26)];
const conditionsL = [new ConditionL(SDQL_OperatorName("l"), null, 24)];
const conditionsL2 = [new ConditionL(SDQL_OperatorName("l"), null, 25)];
const conditionsL3 = [new ConditionL(SDQL_OperatorName("l"), null, 26)];

const conditionsE = [new ConditionE(SDQL_OperatorName("e"), null, 25)];
const conditionsE2 = [new ConditionE(SDQL_OperatorName("e"), null, 26)];

const conditionsGEandL = [
  new ConditionGE(SDQL_OperatorName("ge"), null, 20),
  new ConditionL(SDQL_OperatorName("l"), null, 30),
];

const queryCID = IpfsCID("mockCID");
class QueryEvaluatorMocks {
  public balanceQueryEvaluator = td.object<IBalanceQueryEvaluator>();
  public blockchainTransactionQueryEvaluator =
    td.object<IBlockchainTransactionQueryEvaluator>();
  public nftQueryEvaluator = td.object<INftQueryEvaluator>();
  public web3AccountQueryEvaluator = td.object<IWeb3AccountQueryEvaluator>();
  public demoDataRepo = td.object<IDemographicDataRepository>();
  public browsingDataRepo = td.object<IBrowsingDataRepository>();
  public transactionRepo = td.object<ITransactionHistoryRepository>();
  public socialRepo = td.object<ISocialRepository>();
  public contextProvider: ContextProviderMock;
  public URLmap: SiteVisitsMap = new Map<URLString, SiteVisitsData>([
    [
      URLString("www.snickerdoodlelabs.io"),
      new SiteVisitsData(
        10,
        3,
        UnixTimestamp(12),
        ISO8601DateString("2022-09-15T18:45:30.123Z"),
      ),
    ],
  ]);

  public evmReturns: EVMTransaction[] = [
    new EVMTransaction(
      ChainId(43113),
      EVMTransactionHash("firstHash"),
      UnixTimestamp(100),
      null,
      EVMAccountAddress("send200"),
      EVMAccountAddress("0x14791697260E4c9A71f18484C9f997B308e59325"),
      BigNumberString("200"),
      null,
      null,
      null,
      null,
      null,
      null,
      iso,
    ),
    new EVMTransaction(
      ChainId(43113),
      EVMTransactionHash("secondHash"),
      UnixTimestamp(100),
      null,
      EVMAccountAddress("0x14791697260E4c9A71f18484C9f997B308e59325"),
      EVMAccountAddress("get1000"),
      BigNumberString("1000"),
      null,
      null,
      null,
      null,
      null,
      null,
      iso,
    ),
    new EVMTransaction(
      ChainId(43113),
      EVMTransactionHash("thirdHash"),
      UnixTimestamp(100),
      null,
      EVMAccountAddress("send300"),
      EVMAccountAddress("0x14791697260E4c9A71f18484C9f997B308e59325"),
      BigNumberString("300"),
      null,
      null,
      null,
      null,
      null,
      null,
      iso,
    ),
    new EVMTransaction(
      ChainId(43113),
      EVMTransactionHash("fourthHash"),
      UnixTimestamp(100),
      null,
      EVMAccountAddress("send50"),
      EVMAccountAddress("0x14791697260E4c9A71f18484C9f997B308e59325"),
      BigNumberString("50"),
      null,
      null,
      null,
      null,
      null,
      null,
      iso,
    ),
  ];

  public transactionsReturn = [
    {
      chainId: ChainId(43113),
      items: this.evmReturns,
    },
  ];

  public transactionsFlow = new Array<TransactionFlowInsight>();
  // {
  //   chainId: ChainId(1),
  //   incomingValue: BigNumberString("1"),
  //   incomingCount: BigNumberString("293820383028"),
  //   outgoingValue: BigNumberString("5"),
  //   outgoingCount: BigNumberString("41031830109120"),
  // },
  // {
  //   chainId: ChainId(137),
  //   incomingValue: BigNumberString("1"),
  //   incomingCount: BigNumberString("2020292"),
  //   outgoingValue: BigNumberString("1"),
  //   outgoingCount: BigNumberString("4928"),
  // },
  // {
  //   chainId: ChainId(43113),
  //   incomingValue: BigNumberString("1"),
  //   incomingCount: BigNumberString("9482928"),
  //   outgoingValue: BigNumberString("0"),
  //   outgoingCount: BigNumberString("0"),
  // },

  public constructor() {
    td.when(this.demoDataRepo.getAge()).thenReturn(okAsync(Age(25)));
    this.contextProvider = new ContextProviderMock();
    td.when(this.demoDataRepo.getGender()).thenReturn(okAsync(Gender("male")));

    td.when(
      this.browsingDataRepo.getSiteVisitsMap(td.matchers.anything()),
    ).thenReturn(okAsync(this.URLmap));

    td.when(this.transactionRepo.getTransactionByChain()).thenReturn(
      okAsync(this.transactionsFlow),
    );

    // td.when(this.dataWalletPersistence.getAccountBalances()).thenReturn(
    //   okAsync(this.accountBalances),
    // );
  }

  public factory() {
    return new QueryEvaluator(
      this.balanceQueryEvaluator,
      this.blockchainTransactionQueryEvaluator,
      this.nftQueryEvaluator,
      this.demoDataRepo,
      this.browsingDataRepo,
      this.transactionRepo,
      this.socialRepo,
      this.contextProvider,
      this.web3AccountQueryEvaluator,
    );
    // td.when(this.dataWalletPersistence.getTransactionsMap())
    // .thenReturn(
    //     okAsync(this.chainTransactions),
    // );
  }
}

describe("QueryEvaluator checking age boolean: GE", () => {
  test("EvalPropertyQuery: when age is 25 >= 20, returns true", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsGE,
      [],
      {},
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery, queryCID, queryTimestamp);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(true);
  });

  test("EvalPropertyQuery: when age is 25 >= 25, returns true", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsGE2,
      [],
      {},
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery, queryCID, queryTimestamp);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(true);
  });
  test("EvalPropertyQuery: when age 25 >= 30, returns false", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsGE3,
      [],
      {},
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery, queryCID, queryTimestamp);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(false);
  });
});

describe("QueryEvaluator checking age boolean: LE", () => {
  test("EvalPropertyQuery: when age is 25 <= 20, returns false", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsLE,
      [],
      {},
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery, queryCID, queryTimestamp);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(false);
  });
  test("EvalPropertyQuery: when age is 25 <= 25, returns true", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsLE2,
      [],
      {},
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery, queryCID, queryTimestamp);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(true);
  });
  test("EvalPropertyQuery: when age 25 <= 30, returns true", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsLE3,
      [],
      {},
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery, queryCID, queryTimestamp);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(true);
  });
});

describe("QueryEvaluator checking age boolean: G", () => {
  test("EvalPropertyQuery: when age is 25 > 24, returns true", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsG,
      [],
      {},
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery, queryCID, queryTimestamp);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(true);
  });

  test("EvalPropertyQuery: when age is 25 > 25, returns false", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsG2,
      [],
      {},
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery, queryCID, queryTimestamp);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(false);
  });

  test("EvalPropertyQuery: when age is 25 > 26, returns false", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsG3,
      [],
      {},
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery, queryCID, queryTimestamp);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(false);
  });
});

describe("QueryEvaluator checking age boolean: L", () => {
  test("EvalPropertyQuery: when age is 25 < 24, returns false", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsL,
      [],
      {},
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery, queryCID, queryTimestamp);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(false);
  });

  test("EvalPropertyQuery: when age is 25 < 25, returns false", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsL2,
      [],
      {},
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery, queryCID, queryTimestamp);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(false);
  });

  test("EvalPropertyQuery: when age is 25 < 26, returns true", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsL3,
      [],
      {},
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery, queryCID, queryTimestamp);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(true);
  });
});

describe("QueryEvaluator checking age boolean: GE", () => {
  test("EvalPropertyQuery: when age is 25 >= 20, returns true", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsGE,
      [],
      {},
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery, queryCID, queryTimestamp);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(true);
  });

  test("EvalPropertyQuery: when age is 25 >= 25, returns true", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsGE2,
      [],
      {},
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery, queryCID, queryTimestamp);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(true);
  });
  test("EvalPropertyQuery: when age 25 >= 30, returns false", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsGE3,
      [],
      {},
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery, queryCID, queryTimestamp);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(false);
  });
});

describe("QueryEvaluator checking age boolean: LE", () => {
  test("EvalPropertyQuery: when age is 25 <= 20, returns false", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsLE,
      [],
      {},
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery, queryCID, queryTimestamp);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(false);
  });
  test("EvalPropertyQuery: when age is 25 <= 25, returns true", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsLE2,
      [],
      {},
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery, queryCID, queryTimestamp);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(true);
  });
  test("EvalPropertyQuery: when age 25 <= 30, returns true", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsLE3,
      [],
      {},
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery, queryCID, queryTimestamp);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(true);
  });
});

describe("QueryEvaluator checking age boolean: G", () => {
  test("EvalPropertyQuery: when age is 25 > 24, returns true", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsG,
      [],
      {},
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery, queryCID, queryTimestamp);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(true);
  });

  test("EvalPropertyQuery: when age is 25 > 25, returns false", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsG2,
      [],
      {},
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery, queryCID, queryTimestamp);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(false);
  });

  test("EvalPropertyQuery: when age is 25 > 26, returns false", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsG3,
      [],
      {},
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery, queryCID, queryTimestamp);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(false);
  });
});

describe("QueryEvaluator checking age boolean: L", () => {
  test("EvalPropertyQuery: when age is 25 < 24, returns false", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsL,
      [],
      {},
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery, queryCID, queryTimestamp);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(false);
  });

  test("EvalPropertyQuery: when age is 25 < 25, returns false", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsL2,
      [],
      {},
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery, queryCID, queryTimestamp);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(false);
  });

  test("EvalPropertyQuery: when age is 25 < 26, returns true", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsL3,
      [],
      {},
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery, queryCID, queryTimestamp);

    expect(result).toBeDefined();
    expect(result["value"]).toBe(true);
  });
});

describe("QueryEvaluator checking age boolean: E", () => {
  test("EvalPropertyQuery: when age is 25 == 25, returns true", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsE,
      [],
      {},
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery, queryCID, queryTimestamp);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(true);
  });
  test("EvalPropertyQuery: when age is 25 == 26, returns false", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsE2,
      [],
      {},
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery, queryCID, queryTimestamp);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(false);
  });
});
/*
describe("QueryEvaluator checking location condition in", () => {
    test("EvalPropertyQuery: when location is in ConditionIn, return true", async () => {
        const conditionsIn = new ConditionIn(
            SDQL_OperatorName('in'), 
            57, 
            [62, 85, 57, 45])
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            ISDQLQueryReturnEnum.BOOLEAN,
            "location",
            [conditionsIn],
            []
        )
        const mocks = new QueryEvaluatorMocks();
        const repo = mocks.factory();
        const result = await repo.eval(propertyQuery);
        expect(result).toBeDefined();
        expect(result["value"]).toBe(true);
    })
    test("EvalPropertyQuery: when location is NOT in ConditionIn, return false", async () => {
        const conditionsIn2 = new ConditionIn(
            SDQL_OperatorName('in'), 
            57, 
            [62, 85, 45])
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            ISDQLQueryReturnEnum.BOOLEAN,
            "location",
            [conditionsIn2],
            []
        )
        //console.log(propertyQuery);
        //  DO the mocks to get age
        // DO the rest
        const mocks = new QueryEvaluatorMocks();
        const repo = mocks.factory();
        const result = await repo.eval(propertyQuery);
        expect(result).toBeDefined();
        expect(result["value"]).toBe(false);
    });
})
*/
describe("QueryEvaluator return integer values", () => {
  test("EvalPropertyQuery: return age", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Integer,
      "age",
      [],
      [],
      {},
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery, queryCID, queryTimestamp);
    // console.log("Age is: ", result["value"]);
    expect(result["value"]).toEqual(Age(25));
  });
  /*
    test("EvalPropertyQuery: return location", async () => {
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "integer",
            "location",
            [],
            []
        )
        const mocks = new QueryEvaluatorMocks();
        const repo = mocks.factory();
        const result = await repo.eval(propertyQuery);
        // console.log("Location is: ", result["value"]);
        expect(result["value"]).toEqual(CountryCode(57))
    })
    */

  test("EvalPropertyQuery: return gender as male", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Enum,
      "gender",
      [],
      ["male", "female", "non-binary", "unknown"],
      {},
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery, queryCID, queryTimestamp);
    // console.log("Gender is: ", result["value"]);
    expect(result["value"]).toEqual(Gender("male"));
  });
});

describe("Return URLs Map", () => {
  test("EvalPropertyQuery: return URLs count ", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Object,
      "url_visited_count",
      [],
      [],
      {},
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();

    const result = await repo.eval(propertyQuery, queryCID, queryTimestamp);
    // console.log("URLs is: ", result["value"]);
    expect(result["value"]).toEqual({
      "www.snickerdoodlelabs.io": {
        averageScreenTime: 3,
        lastReportedTime: "2022-09-15T18:45:30.123Z",
        numberOfVisits: 10,
        totalScreenTime: 12,
      },
    });
  });
});
