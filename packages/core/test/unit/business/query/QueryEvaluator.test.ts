import "reflect-metadata";

import {
  Age,
  ChainId,
  EVMAccountAddress,
  EVMContractAddress,
  Gender,
  SDQL_Name,
  SDQL_OperatorName,
  URLString,
  TickerSymbol,
  BigNumberString,
  TokenBalance,
  EVMTransaction,
  UnixTimestamp,
  EVMTransactionHash,
  EChainTechnology,
  TransactionPaymentCounter,
  ESDQLQueryReturn,
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
import { IProfileService } from "@core/interfaces/business";
import {
  IBalanceQueryEvaluator,
  IBlockchainTransactionQueryEvaluator,
  INftQueryEvaluator,
} from "@core/interfaces/business/utilities/query/index.js";
import {
  IBrowsingDataRepository,
  ITransactionHistoryRepository,
  IDemographicDataRepository,
} from "@core/interfaces/data/index.js";

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

class QueryEvaluatorMocks {
  public balanceQueryEvaluator = td.object<IBalanceQueryEvaluator>();
  public blockchainTransactionQueryEvaluator =
    td.object<IBlockchainTransactionQueryEvaluator>();
  public nftQueryEvaluator = td.object<INftQueryEvaluator>();
  public profileService = td.object<IProfileService>();
  public demoDataRepo = td.object<IDemographicDataRepository>();
  public browsingDataRepo = td.object<IBrowsingDataRepository>();
  public transactionRepo = td.object<ITransactionHistoryRepository>();

  public URLmap = new Map<URLString, number>([
    [URLString("www.snickerdoodlelabs.io"), 10],
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
    ),
  ];

  public transactionsReturn = [
    {
      chainId: ChainId(43113),
      items: this.evmReturns,
    },
  ];

  public accountBalances = new Array<TokenBalance>(
    new TokenBalance(
      EChainTechnology.EVM,
      TickerSymbol("ETH"),
      ChainId(1),
      EVMContractAddress("9dkj13nd"),
      EVMAccountAddress("GOOD1"),
      BigNumberString("18"),
      18,
    ),
    new TokenBalance(
      EChainTechnology.EVM,
      TickerSymbol("ETH"),
      ChainId(1),
      EVMContractAddress("0pemc726"),
      EVMAccountAddress("GOOD2"),
      BigNumberString("25"),
      18,
    ),
    new TokenBalance(
      EChainTechnology.EVM,
      TickerSymbol("BLAH"),
      ChainId(901398),
      EVMContractAddress("lp20xk3c"),
      EVMAccountAddress("BAD"),
      BigNumberString("26"),
      18,
    ),
    new TokenBalance(
      EChainTechnology.EVM,
      TickerSymbol("ETH"),
      ChainId(1),
      EVMContractAddress("m12s93io"),
      EVMAccountAddress("GOOD3"),
      BigNumberString("36"),
      18,
    ),
  );

  public transactionsFlow = new Array<TransactionPaymentCounter>();
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
    td.when(this.profileService.getAge()).thenReturn(okAsync(Age(25)));

    td.when(this.demoDataRepo.getGender()).thenReturn(okAsync(Gender("male")));

    td.when(this.browsingDataRepo.getSiteVisitsMap(td.matchers.anything())).thenReturn(
      okAsync(this.URLmap),
    );

    td.when(this.transactionRepo.getTransactionValueByChain()).thenReturn(
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
      this.profileService,
      this.demoDataRepo,
      this.browsingDataRepo,
      this.transactionRepo,
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
      { name: "q1", return: ESDQLQueryReturn.Boolean , enum_keys : [] , patternProperties : {} }
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(true);
  });

  test("EvalPropertyQuery: when age is 25 >= 25, returns true", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsGE2,
      { name: "q1", return: ESDQLQueryReturn.Boolean , enum_keys : [] , patternProperties : {} }
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(true);
  });
  test("EvalPropertyQuery: when age 25 >= 30, returns false", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsGE3,
      { name: "q1", return: ESDQLQueryReturn.Boolean , enum_keys : [] , patternProperties : {} }
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery);
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
      { name: "q1", return: ESDQLQueryReturn.Boolean , enum_keys : [] , patternProperties : {} }
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(false);
  });
  test("EvalPropertyQuery: when age is 25 <= 25, returns true", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsLE2,
      { name: "q1", return: ESDQLQueryReturn.Boolean , enum_keys : [] , patternProperties : {} }
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(true);
  });
  test("EvalPropertyQuery: when age 25 <= 30, returns true", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsLE3,
      { name: "q1", return: ESDQLQueryReturn.Boolean , enum_keys : [] , patternProperties : {} }
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery);
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
      { name: "q1", return: ESDQLQueryReturn.Boolean , enum_keys : [] , patternProperties : {} }
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(true);
  });

  test("EvalPropertyQuery: when age is 25 > 25, returns false", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsG2,
      { name: "q1", return: ESDQLQueryReturn.Boolean , enum_keys : [] , patternProperties : {} }
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(false);
  });

  test("EvalPropertyQuery: when age is 25 > 26, returns false", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsG3,
      { name: "q1", return: ESDQLQueryReturn.Boolean , enum_keys : [] , patternProperties : {} }
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery);
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
      { name: "q1", return: ESDQLQueryReturn.Boolean , enum_keys : [] , patternProperties : {} }
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(false);
  });

  test("EvalPropertyQuery: when age is 25 < 25, returns false", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsL2,
      { name: "q1", return: ESDQLQueryReturn.Boolean , enum_keys : [] , patternProperties : {} }
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(false);
  });

  test("EvalPropertyQuery: when age is 25 < 26, returns true", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsL3,
      { name: "q1", return: ESDQLQueryReturn.Boolean , enum_keys : [] , patternProperties : {} }
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery);
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
      { name: "q1", return: ESDQLQueryReturn.Boolean , enum_keys : [] , patternProperties : {} }
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(true);
  });

  test("EvalPropertyQuery: when age is 25 >= 25, returns true", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsGE2,
      { name: "q1", return: ESDQLQueryReturn.Boolean , enum_keys : [] , patternProperties : {} }
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(true);
  });
  test("EvalPropertyQuery: when age 25 >= 30, returns false", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsGE3,
      { name: "q1", return: ESDQLQueryReturn.Boolean , enum_keys : [] , patternProperties : {} }
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery);
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
      { name: "q1", return: ESDQLQueryReturn.Boolean , enum_keys : [] , patternProperties : {} }
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(false);
  });
  test("EvalPropertyQuery: when age is 25 <= 25, returns true", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsLE2,
      { name: "q1", return: ESDQLQueryReturn.Boolean , enum_keys : [] , patternProperties : {} }
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(true);
  });
  test("EvalPropertyQuery: when age 25 <= 30, returns true", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsLE3,
      { name: "q1", return: ESDQLQueryReturn.Boolean , enum_keys : [] , patternProperties : {} }
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery);
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
      { name: "q1", return: ESDQLQueryReturn.Boolean , enum_keys : [] , patternProperties : {} }
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(true);
  });

  test("EvalPropertyQuery: when age is 25 > 25, returns false", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsG2,
      { name: "q1", return: ESDQLQueryReturn.Boolean , enum_keys : [] , patternProperties : {} }
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(false);
  });

  test("EvalPropertyQuery: when age is 25 > 26, returns false", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsG3,
      { name: "q1", return: ESDQLQueryReturn.Boolean , enum_keys : [] , patternProperties : {} }
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery);
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
      { name: "q1", return: ESDQLQueryReturn.Boolean , enum_keys : [] , patternProperties : {} }
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(false);
  });

  test("EvalPropertyQuery: when age is 25 < 25, returns false", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsL2,
      { name: "q1", return: ESDQLQueryReturn.Boolean , enum_keys : [] , patternProperties : {} }
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(false);
  });

  test("EvalPropertyQuery: when age is 25 < 26, returns true", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsL3,
      { name: "q1", return: ESDQLQueryReturn.Boolean , enum_keys : [] , patternProperties : {} }
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery);

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
      { name: "q1", return: ESDQLQueryReturn.Boolean , enum_keys : [] , patternProperties : {} }
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(true);
  });
  test("EvalPropertyQuery: when age is 25 == 26, returns false", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "age",
      conditionsE2,
      { name: "q1", return: ESDQLQueryReturn.Boolean , enum_keys : [] , patternProperties : {} }
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery);
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
      { name: "q1", return: ESDQLQueryReturn.Integer , enum_keys : [] , patternProperties : {} }
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery);
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
      { name: "q1", return: ESDQLQueryReturn.Enum , enum_keys :  ["male", "female", "non-binary", "unknown"] , patternProperties : {} }
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery);
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
      { name: "q1", return: ESDQLQueryReturn.Object , enum_keys :  [], patternProperties : {} }
    );
    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    
    const result = await repo.eval(propertyQuery);
    // console.log("URLs is: ", result["value"]);
    expect(result["value"]).toEqual(
      new Map<URLString, number>([[URLString("www.snickerdoodlelabs.io"), 10]]),
    );
  });


});

describe("Return Chain Transaction Flow", () => {
  test("EvalPropertyQuery: return chain_transactions", async () => {
    const propertyQuery = new AST_PropertyQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Array,
      "chain_transactions",
      [],
      { name: "q1", return: ESDQLQueryReturn.Array , enum_keys :  [], patternProperties : {
        "^ETH|AVAX|SOL$": {
          type: "integer",
        },
      }, }
      
    );

    //const conditionsGE = [new ConditionGE(SDQL_OperatorName("ge"), null, 20)];

    const mocks = new QueryEvaluatorMocks();
    const repo = mocks.factory();
    const result = await repo.eval(propertyQuery);

    // console.log("URLs is: ", result["value"]);
    //   expect(result["value"]).toEqual(
    //     new Array<IChainTransaction>(
    //       {
    //         chainId: ChainId(1),
    //         incomingValue: BigNumberString("1"),
    //         incomingCount: BigNumberString("293820383028"),
    //         outgoingValue: BigNumberString("5"),
    //         outgoingCount: BigNumberString("41031830109120"),
    //       },
    //       {
    //         chainId: ChainId(137),
    //         incomingValue: BigNumberString("1"),
    //         incomingCount: BigNumberString("2020292"),
    //         outgoingValue: BigNumberString("1"),
    //         outgoingCount: BigNumberString("4928"),
    //       },
    //       {
    //         chainId: ChainId(43113),
    //         incomingValue: BigNumberString("1"),
    //         incomingCount: BigNumberString("9482928"),
    //         outgoingValue: BigNumberString("0"),
    //         outgoingCount: BigNumberString("0"),
    //       },
    //     ),
    //   );
  });
});
