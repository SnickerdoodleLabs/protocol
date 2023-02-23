import "reflect-metadata";

import {
  TokenBalance,
  ChainId,
  EVMAccountAddress,
  EVMContractAddress,
  Gender,
  SDQL_Name,
  SDQL_OperatorName,
  URLString,
  TickerSymbol,
  BigNumberString,
  EChainTechnology,
  ESDQLQueryReturn,
  Age,
} from "@snickerdoodlelabs/objects";
import {
  AST_BalanceQuery,
  ConditionE,
  ConditionG,
  ConditionGE,
  ConditionIn,
  ConditionL,
  ConditionLE,
} from "@snickerdoodlelabs/query-parser";
import { BigNumber } from "ethers";
import { okAsync } from "neverthrow";
import * as td from "testdouble";

import { BalanceQueryEvaluator } from "@core/implementations/business/utilities/query/BalanceQueryEvaluator";
import { IBalanceQueryEvaluator } from "@core/interfaces/business/utilities/query/IBalanceQueryEvaluator";
import {
  IBrowsingDataRepository,
  IDemographicDataRepository,
  IPortfolioBalanceRepository,
} from "@core/interfaces/data";

const conditionsGEandL = [
  new ConditionGE(SDQL_OperatorName("ge"), null, 0),
  new ConditionL(SDQL_OperatorName("l"), null, 500),
];
const conditionsGandLE = [
  new ConditionG(SDQL_OperatorName("g"), null, 20),
  new ConditionLE(SDQL_OperatorName("le"), null, 30),
];

const conditionsGE = [new ConditionGE(SDQL_OperatorName("ge"), null, 10)];
const conditionsE = [new ConditionE(SDQL_OperatorName("e"), null, 29)];

const conditionsIn = [new ConditionIn(SDQL_OperatorName("e"), null, ["29"])];

class BalanceQueryEvaluatorMocks {
  public balanceRepo = td.object<IPortfolioBalanceRepository>();
  public demoRepo = td.object<IDemographicDataRepository>();
  public browsingRepo = td.object<IBrowsingDataRepository>();
  public balanceQueryEvaluator = td.object<IBalanceQueryEvaluator>();

  public URLmap = new Map<URLString, number>([
    [URLString("www.snickerdoodlelabs.io"), 10],
  ]);

  public constructor() {
    td.when(this.demoRepo.getAge()).thenReturn(okAsync(Age(25)));
    td.when(this.demoRepo.getGender()).thenReturn(okAsync(Gender("male")));
    td.when(this.browsingRepo.getSiteVisitsMap()).thenReturn(
      okAsync(this.URLmap),
    );
  }

  public factory() {
    return new BalanceQueryEvaluator(this.balanceRepo);
  }
}

describe("BalanceQueryEvaluator", () => {
  test("Sample data 1 - every chainId/contractAddress has a balance > 0", async () => {
    const balanceQuery = new AST_BalanceQuery(
      SDQL_Name("q7"),
      ESDQLQueryReturn.Array,
      null, // * - for all, use null
      [],
    );

    const mocks = new BalanceQueryEvaluatorMocks();
    td.when(mocks.balanceRepo.getAccountBalances()).thenReturn(
      okAsync(
        new Array<TokenBalance | any>(
          {
            ticker: "MATIC",
            chainId: 80001,
            accountAddress: "",
            balance: "100",
            tokenAddress: "0x0000000000000000000000000000000000001010",
            quoteBalance: 0,
          },
          {
            ticker: "AVAX",
            chainId: 43113,
            accountAddress: "",
            balance: "100",
            tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            quoteBalance: 0,
          },
          {
            ticker: "ETH",
            chainId: 1,
            accountAddress: "",
            balance: "5906596049814560",
            tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            quoteBalance: 7.5055704,
          },
          {
            ticker: "MATIC",
            chainId: 1,
            accountAddress: "",
            balance: "14338174027714340563",
            tokenAddress: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
            quoteBalance: 0,
          },
          {
            ticker: "MATIC",
            chainId: 137,
            accountAddress: "",
            balance: "100",
            tokenAddress: "0x0000000000000000000000000000000000001010",
            quoteBalance: 0,
          },
          {
            ticker: "AVAX",
            chainId: 43114,
            accountAddress: "",
            balance: "100",
            tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            quoteBalance: 0,
          },
        ),
      ),
    );
    const repo = mocks.factory();

    const result = await repo.eval(balanceQuery);
    console.log("result: ", result);
    expect(result["value"].length).toEqual(6);

    expect(result["value"][0].ticker).toEqual("MATIC");
    expect(result["value"][1].ticker).toEqual("AVAX");
    expect(result["value"][2].ticker).toEqual("ETH");
    expect(result["value"][3].ticker).toEqual("MATIC");
    expect(result["value"][4].ticker).toEqual("MATIC");
    expect(result["value"][5].ticker).toEqual("AVAX");

    expect(result["value"][0].chainId).toEqual(80001);
    expect(result["value"][1].chainId).toEqual(43113);
    expect(result["value"][2].chainId).toEqual(1);
    expect(result["value"][3].chainId).toEqual(1);
    expect(result["value"][4].chainId).toEqual(137);
    expect(result["value"][5].chainId).toEqual(43114);

    expect(result["value"][0].balance).toEqual("100");
    expect(result["value"][1].balance).toEqual("100");
    expect(result["value"][2].balance).toEqual("5906596049814560");
    expect(result["value"][3].balance).toEqual("14338174027714340563");
    expect(result["value"][4].balance).toEqual("100");
    expect(result["value"][5].balance).toEqual("100");
  });

  test("Sample data 2 - some chainId/contractAddress has a balance = 0", async () => {
    const balanceQuery = new AST_BalanceQuery(
      SDQL_Name("q7"),
      ESDQLQueryReturn.Array,
      null, // * - for all, use null
      [],
    );

    const mocks = new BalanceQueryEvaluatorMocks();
    td.when(mocks.balanceRepo.getAccountBalances()).thenReturn(
      okAsync(
        new Array<TokenBalance | any>(
          {
            ticker: "MATIC",
            chainId: 80001,
            accountAddress: "",
            balance: "0",
            tokenAddress: "0x0000000000000000000000000000000000001010",
            quoteBalance: 0,
          },
          {
            ticker: "AVAX",
            chainId: 43113,
            accountAddress: "",
            balance: "0",
            tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            quoteBalance: 0,
          },
          {
            ticker: "ETH",
            chainId: 1,
            accountAddress: "",
            balance: "5906596049814560",
            tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            quoteBalance: 7.5055704,
          },
          {
            ticker: "MATIC",
            chainId: 1,
            accountAddress: "",
            balance: "14338174027714340563",
            tokenAddress: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
            quoteBalance: 0,
          },
          {
            ticker: "MATIC",
            chainId: 137,
            accountAddress: "",
            balance: "0",
            tokenAddress: "0x0000000000000000000000000000000000001010",
            quoteBalance: 0,
          },
          {
            ticker: "AVAX",
            chainId: 43114,
            accountAddress: "",
            balance: "0",
            tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            quoteBalance: 0,
          },
        ),
      ),
    );
    const repo = mocks.factory();

    const result = await repo.eval(balanceQuery);
    console.log("result: ", result);

    expect(result["value"].length).toEqual(2);
    expect(result["value"][0].ticker).toEqual("ETH");
    expect(result["value"][1].ticker).toEqual("MATIC");

    expect(result["value"][0].chainId).toEqual(1);
    expect(result["value"][1].chainId).toEqual(1);

    expect(result["value"][0].balance).toEqual("5906596049814560");
    expect(result["value"][1].balance).toEqual("14338174027714340563");
  });

  test("All Zero Balances: return array of length 0", async () => {
    const balanceQuery = new AST_BalanceQuery(
      SDQL_Name("q7"),
      ESDQLQueryReturn.Array,
      null, // * - for all, use null
      [],
    );

    const mocks = new BalanceQueryEvaluatorMocks();
    td.when(mocks.balanceRepo.getAccountBalances()).thenReturn(
      okAsync(
        new Array<TokenBalance | any>(
          {
            ticker: "MATIC",
            chainId: 80001,
            accountAddress: "",
            balance: "0",
            tokenAddress: "0x0000000000000000000000000000000000001010",
            quoteBalance: 0,
          },
          {
            ticker: "AVAX",
            chainId: 43113,
            accountAddress: "",
            balance: "0",
            tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            quoteBalance: 0,
          },
          {
            ticker: "ETH",
            chainId: 1,
            accountAddress: "",
            balance: "0",
            tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            quoteBalance: 7.5055704,
          },
          {
            ticker: "MATIC",
            chainId: 1,
            accountAddress: "",
            balance: "0",
            tokenAddress: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
            quoteBalance: 0,
          },
          {
            ticker: "MATIC",
            chainId: 137,
            accountAddress: "",
            balance: "0",
            tokenAddress: "0x0000000000000000000000000000000000001010",
            quoteBalance: 0,
          },
          {
            ticker: "AVAX",
            chainId: 43114,
            accountAddress: "",
            balance: "0",
            tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            quoteBalance: 0,
          },
        ),
      ),
    );
    const repo = mocks.factory();

    const result = await repo.eval(balanceQuery);
    expect(result["value"].length).toEqual(0);
  });

  test("Only Accept ChainId(1) EVMBalances", async () => {
    const balanceQuery = new AST_BalanceQuery(
      SDQL_Name("q7"),
      ESDQLQueryReturn.Array,
      ChainId(1), // * - for all, use null
      [],
    );

    const mocks = new BalanceQueryEvaluatorMocks();
    td.when(mocks.balanceRepo.getAccountBalances()).thenReturn(
      okAsync(
        new Array<TokenBalance | any>(
          {
            ticker: "MATIC",
            chainId: 80001,
            accountAddress: "",
            balance: "0",
            tokenAddress: "0x0000000000000000000000000000000000001010",
            quoteBalance: 0,
          },
          {
            ticker: "AVAX",
            chainId: 43113,
            accountAddress: "",
            balance: "0",
            tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            quoteBalance: 0,
          },
          {
            ticker: "ETH",
            chainId: 1,
            accountAddress: "",
            balance: "5906596049814560",
            tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            quoteBalance: 7.5055704,
          },
          {
            ticker: "MATIC",
            chainId: 1,
            accountAddress: "",
            balance: "14338174027714340563",
            tokenAddress: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
            quoteBalance: 0,
          },
          {
            ticker: "MATIC",
            chainId: 137,
            accountAddress: "",
            balance: "0",
            tokenAddress: "0x0000000000000000000000000000000000001010",
            quoteBalance: 0,
          },
          {
            ticker: "AVAX",
            chainId: 43114,
            accountAddress: "",
            balance: "0",
            tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            quoteBalance: 0,
          },
        ),
      ),
    );
    const repo = mocks.factory();

    const result = await repo.eval(balanceQuery);
    console.log("result: ", result);

    expect(result["value"].length).toEqual(2);
    expect(result["value"][0].ticker).toEqual("ETH");
    expect(result["value"][1].ticker).toEqual("MATIC");

    expect(result["value"][0].chainId).toEqual(1);
    expect(result["value"][1].chainId).toEqual(1);

    expect(result["value"][0].balance).toEqual("5906596049814560");
    expect(result["value"][1].balance).toEqual("14338174027714340563");
  });

  test("(20 <= Balance < 30) - ALL VALUES", async () => {
    const balanceQuery = new AST_BalanceQuery(
      SDQL_Name("q7"),
      ESDQLQueryReturn.Array,
      null,
      conditionsGEandL,
    );
    // >= 20 and < 30
    const mocks = new BalanceQueryEvaluatorMocks();
    const repo = mocks.factory();

    td.when(mocks.balanceRepo.getAccountBalances()).thenReturn(
      okAsync(
        new Array<TokenBalance | any>(
          {
            ticker: "MATIC",
            chainId: 80001,
            accountAddress: "",
            balance: "150",
            tokenAddress: "0x0000000000000000000000000000000000001010",
            quoteBalance: 0,
          },
          {
            ticker: "AVAX",
            chainId: 43113,
            accountAddress: "",
            balance: "1",
            tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            quoteBalance: 0,
          },
          {
            ticker: "ETH",
            chainId: 1,
            accountAddress: "",
            balance: "501",
            tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            quoteBalance: 7.5055704,
          },
          {
            ticker: "MATIC",
            chainId: 1,
            accountAddress: "",
            balance: "499",
            tokenAddress: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
            quoteBalance: 0,
          },
          {
            ticker: "MATIC",
            chainId: 137,
            accountAddress: "",
            balance: "0",
            tokenAddress: "0x0000000000000000000000000000000000001010",
            quoteBalance: 0,
          },
          {
            ticker: "AVAX",
            chainId: 43114,
            accountAddress: "",
            balance: "20",
            tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            quoteBalance: 0,
          },
        ),
      ),
    );

    const result = await repo.eval(balanceQuery);
    console.log("result: ", result);

    expect(result["value"].length).toEqual(4);
    expect(result["value"][0].ticker).toEqual("MATIC");
    expect(result["value"][1].ticker).toEqual("AVAX");
    expect(result["value"][2].ticker).toEqual("MATIC");
    expect(result["value"][3].ticker).toEqual("AVAX");

    expect(result["value"][0].chainId).toEqual(80001);
    expect(result["value"][1].chainId).toEqual(43113);
    expect(result["value"][2].chainId).toEqual(1);
    expect(result["value"][3].chainId).toEqual(43114);

    expect(result["value"][0].balance).toEqual("150");
    expect(result["value"][1].balance).toEqual("1");
    expect(result["value"][2].balance).toEqual("499");
    expect(result["value"][3].balance).toEqual("20");
  });
});
