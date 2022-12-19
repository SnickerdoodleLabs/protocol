import "reflect-metadata";

import {
  IDataWalletPersistence,
  IEVMBalance,
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
  IChainTransaction,
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
  public dataWalletPersistence = td.object<IDataWalletPersistence>();
  public balanceQueryEvaluator = td.object<IBalanceQueryEvaluator>();

  public URLmap = new Map<URLString, number>([
    [URLString("www.snickerdoodlelabs.io"), 10],
  ]);

  public constructor() {
    this.dataWalletPersistence.setAge(Age(25));
    td.when(this.dataWalletPersistence.getAge()).thenReturn(okAsync(Age(25)));
    td.when(this.dataWalletPersistence.getGender()).thenReturn(
      okAsync(Gender("male")),
    );
    td.when(this.dataWalletPersistence.getSiteVisitsMap()).thenReturn(
      okAsync(this.URLmap),
    );
  }

  public factory() {
    return new BalanceQueryEvaluator(this.dataWalletPersistence);
  }
}

describe("BalanceQueryEvaluator", () => {
  test("Sample data 1 - every chainId/contractAddress has a balance > 0", async () => {
    const balanceQuery = new AST_BalanceQuery(
      SDQL_Name("q7"),
      "array",
      null, // * - for all, use null
      [],
    );

    const mocks = new BalanceQueryEvaluatorMocks();
    td.when(mocks.dataWalletPersistence.getAccountBalances()).thenReturn(
      okAsync(
        new Array<IEVMBalance | any>(
          {
            ticker: "MATIC",
            chainId: 80001,
            accountAddress: "0x33e9bb9d95fad829f18932ef22bda059a34d24c4",
            balance: "100",
            contractAddress: "0x0000000000000000000000000000000000001010",
            quoteBalance: 0,
          },
          {
            ticker: "AVAX",
            chainId: 43113,
            accountAddress: "0x33e9bb9d95fad829f18932ef22bda059a34d24c4",
            balance: "100",
            contractAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            quoteBalance: 0,
          },
          {
            ticker: "ETH",
            chainId: 1,
            accountAddress: "0x33e9bb9d95fad829f18932ef22bda059a34d24c4",
            balance: "5906596049814560",
            contractAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            quoteBalance: 7.5055704,
          },
          {
            ticker: "MATIC",
            chainId: 1,
            accountAddress: "0x33e9bb9d95fad829f18932ef22bda059a34d24c4",
            balance: "14338174027714340563",
            contractAddress: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
            quoteBalance: 0,
          },
          {
            ticker: "MATIC",
            chainId: 137,
            accountAddress: "0x33e9bb9d95fad829f18932ef22bda059a34d24c4",
            balance: "100",
            contractAddress: "0x0000000000000000000000000000000000001010",
            quoteBalance: 0,
          },
          {
            ticker: "AVAX",
            chainId: 43114,
            accountAddress: "0x33e9bb9d95fad829f18932ef22bda059a34d24c4",
            balance: "100",
            contractAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            quoteBalance: 0,
          },
        ),
      ),
    );
    const repo = mocks.factory();

    const result = await repo.eval(balanceQuery);
    expect(result["value"].length).toEqual(6);

    expect(result["value"][0].ticker).toEqual("MATIC");
    expect(result["value"][1].ticker).toEqual("AVAX");
    expect(result["value"][2].ticker).toEqual("ETH");
    expect(result["value"][3].ticker).toEqual("MATIC");
    expect(result["value"][4].ticker).toEqual("MATIC");
    expect(result["value"][5].ticker).toEqual("AVAX");

    expect(result["value"][0].networkId).toEqual(80001);
    expect(result["value"][1].networkId).toEqual(43113);
    expect(result["value"][2].networkId).toEqual(1);
    expect(result["value"][3].networkId).toEqual(1);
    expect(result["value"][4].networkId).toEqual(137);
    expect(result["value"][5].networkId).toEqual(43114);

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
      "array",
      null, // * - for all, use null
      [],
    );

    const mocks = new BalanceQueryEvaluatorMocks();
    td.when(mocks.dataWalletPersistence.getAccountBalances()).thenReturn(
      okAsync(
        new Array<IEVMBalance | any>(
          {
            ticker: "MATIC",
            chainId: 80001,
            accountAddress: "0x33e9bb9d95fad829f18932ef22bda059a34d24c4",
            balance: "0",
            contractAddress: "0x0000000000000000000000000000000000001010",
            quoteBalance: 0,
          },
          {
            ticker: "AVAX",
            chainId: 43113,
            accountAddress: "0x33e9bb9d95fad829f18932ef22bda059a34d24c4",
            balance: "0",
            contractAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            quoteBalance: 0,
          },
          {
            ticker: "ETH",
            chainId: 1,
            accountAddress: "0x33e9bb9d95fad829f18932ef22bda059a34d24c4",
            balance: "5906596049814560",
            contractAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            quoteBalance: 7.5055704,
          },
          {
            ticker: "MATIC",
            chainId: 1,
            accountAddress: "0x33e9bb9d95fad829f18932ef22bda059a34d24c4",
            balance: "14338174027714340563",
            contractAddress: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
            quoteBalance: 0,
          },
          {
            ticker: "MATIC",
            chainId: 137,
            accountAddress: "0x33e9bb9d95fad829f18932ef22bda059a34d24c4",
            balance: "0",
            contractAddress: "0x0000000000000000000000000000000000001010",
            quoteBalance: 0,
          },
          {
            ticker: "AVAX",
            chainId: 43114,
            accountAddress: "0x33e9bb9d95fad829f18932ef22bda059a34d24c4",
            balance: "0",
            contractAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            quoteBalance: 0,
          },
        ),
      ),
    );
    const repo = mocks.factory();

    const result = await repo.eval(balanceQuery);
    expect(result["value"].length).toEqual(2);
    expect(result["value"][0].ticker).toEqual("ETH");
    expect(result["value"][1].ticker).toEqual("MATIC");

    expect(result["value"][0].networkId).toEqual(1);
    expect(result["value"][1].networkId).toEqual(1);

    expect(result["value"][0].balance).toEqual("5906596049814560");
    expect(result["value"][1].balance).toEqual("14338174027714340563");
  });

  test("All Zero Balances: return array of length 0", async () => {
    const balanceQuery = new AST_BalanceQuery(
      SDQL_Name("q7"),
      "array",
      null, // * - for all, use null
      [],
    );

    const mocks = new BalanceQueryEvaluatorMocks();
    td.when(mocks.dataWalletPersistence.getAccountBalances()).thenReturn(
      okAsync(
        new Array<IEVMBalance | any>(
          {
            ticker: "MATIC",
            chainId: 80001,
            accountAddress: "0x33e9bb9d95fad829f18932ef22bda059a34d24c4",
            balance: "0",
            contractAddress: "0x0000000000000000000000000000000000001010",
            quoteBalance: 0,
          },
          {
            ticker: "AVAX",
            chainId: 43113,
            accountAddress: "0x33e9bb9d95fad829f18932ef22bda059a34d24c4",
            balance: "0",
            contractAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            quoteBalance: 0,
          },
          {
            ticker: "ETH",
            chainId: 1,
            accountAddress: "0x33e9bb9d95fad829f18932ef22bda059a34d24c4",
            balance: "0",
            contractAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            quoteBalance: 7.5055704,
          },
          {
            ticker: "MATIC",
            chainId: 1,
            accountAddress: "0x33e9bb9d95fad829f18932ef22bda059a34d24c4",
            balance: "0",
            contractAddress: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
            quoteBalance: 0,
          },
          {
            ticker: "MATIC",
            chainId: 137,
            accountAddress: "0x33e9bb9d95fad829f18932ef22bda059a34d24c4",
            balance: "0",
            contractAddress: "0x0000000000000000000000000000000000001010",
            quoteBalance: 0,
          },
          {
            ticker: "AVAX",
            chainId: 43114,
            accountAddress: "0x33e9bb9d95fad829f18932ef22bda059a34d24c4",
            balance: "0",
            contractAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
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
      "array",
      ChainId(1), // * - for all, use null
      [],
    );

    const mocks = new BalanceQueryEvaluatorMocks();
    td.when(mocks.dataWalletPersistence.getAccountBalances()).thenReturn(
      okAsync(
        new Array<IEVMBalance | any>(
          {
            ticker: "MATIC",
            chainId: 80001,
            accountAddress: "0x33e9bb9d95fad829f18932ef22bda059a34d24c4",
            balance: "0",
            contractAddress: "0x0000000000000000000000000000000000001010",
            quoteBalance: 0,
          },
          {
            ticker: "AVAX",
            chainId: 43113,
            accountAddress: "0x33e9bb9d95fad829f18932ef22bda059a34d24c4",
            balance: "0",
            contractAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            quoteBalance: 0,
          },
          {
            ticker: "ETH",
            chainId: 1,
            accountAddress: "0x33e9bb9d95fad829f18932ef22bda059a34d24c4",
            balance: "5906596049814560",
            contractAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            quoteBalance: 7.5055704,
          },
          {
            ticker: "MATIC",
            chainId: 1,
            accountAddress: "0x33e9bb9d95fad829f18932ef22bda059a34d24c4",
            balance: "14338174027714340563",
            contractAddress: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
            quoteBalance: 0,
          },
          {
            ticker: "MATIC",
            chainId: 137,
            accountAddress: "0x33e9bb9d95fad829f18932ef22bda059a34d24c4",
            balance: "0",
            contractAddress: "0x0000000000000000000000000000000000001010",
            quoteBalance: 0,
          },
          {
            ticker: "AVAX",
            chainId: 43114,
            accountAddress: "0x33e9bb9d95fad829f18932ef22bda059a34d24c4",
            balance: "0",
            contractAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            quoteBalance: 0,
          },
        ),
      ),
    );
    const repo = mocks.factory();

    const result = await repo.eval(balanceQuery);
    console.log(result);
    expect(result["value"].length).toEqual(2);
    expect(result["value"][0].ticker).toEqual("ETH");
    expect(result["value"][1].ticker).toEqual("MATIC");

    expect(result["value"][0].networkId).toEqual(1);
    expect(result["value"][1].networkId).toEqual(1);

    expect(result["value"][0].balance).toEqual("5906596049814560");
    expect(result["value"][1].balance).toEqual("14338174027714340563");
  });

  test("(20 <= Balance < 30) - ALL VALUES", async () => {
    const balanceQuery = new AST_BalanceQuery(
      SDQL_Name("q7"),
      "array",
      null,
      conditionsGEandL,
    );
    // >= 20 and < 30
    const mocks = new BalanceQueryEvaluatorMocks();
    const repo = mocks.factory();

    td.when(mocks.dataWalletPersistence.getAccountBalances()).thenReturn(
      okAsync(
        new Array<IEVMBalance | any>(
          {
            ticker: "MATIC",
            chainId: 80001,
            accountAddress: "0x33e9bb9d95fad829f18932ef22bda059a34d24c4",
            balance: "150",
            contractAddress: "0x0000000000000000000000000000000000001010",
            quoteBalance: 0,
          },
          {
            ticker: "AVAX",
            chainId: 43113,
            accountAddress: "0x33e9bb9d95fad829f18932ef22bda059a34d24c4",
            balance: "1",
            contractAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            quoteBalance: 0,
          },
          {
            ticker: "ETH",
            chainId: 1,
            accountAddress: "0x33e9bb9d95fad829f18932ef22bda059a34d24c4",
            balance: "501",
            contractAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            quoteBalance: 7.5055704,
          },
          {
            ticker: "MATIC",
            chainId: 1,
            accountAddress: "0x33e9bb9d95fad829f18932ef22bda059a34d24c4",
            balance: "499",
            contractAddress: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
            quoteBalance: 0,
          },
          {
            ticker: "MATIC",
            chainId: 137,
            accountAddress: "0x33e9bb9d95fad829f18932ef22bda059a34d24c4",
            balance: "0",
            contractAddress: "0x0000000000000000000000000000000000001010",
            quoteBalance: 0,
          },
          {
            ticker: "AVAX",
            chainId: 43114,
            accountAddress: "0x33e9bb9d95fad829f18932ef22bda059a34d24c4",
            balance: "20",
            contractAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            quoteBalance: 0,
          },
        ),
      ),
    );

    const result = await repo.eval(balanceQuery);
    console.log(result);

    expect(result["value"].length).toEqual(4);
    expect(result["value"][0].ticker).toEqual("MATIC");
    expect(result["value"][1].ticker).toEqual("AVAX");
    expect(result["value"][2].ticker).toEqual("MATIC");
    expect(result["value"][3].ticker).toEqual("AVAX");

    expect(result["value"][0].networkId).toEqual(80001);
    expect(result["value"][1].networkId).toEqual(43113);
    expect(result["value"][2].networkId).toEqual(1);
    expect(result["value"][3].networkId).toEqual(43114);

    expect(result["value"][0].balance).toEqual("150");
    expect(result["value"][1].balance).toEqual("1");
    expect(result["value"][2].balance).toEqual("499");
    expect(result["value"][3].balance).toEqual("20");
  });
});
