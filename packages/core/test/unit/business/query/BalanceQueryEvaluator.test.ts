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
import { IChainTransaction } from "@snickerdoodlelabs/objects";

const conditionsGEandL = [
  new ConditionGE(SDQL_OperatorName("ge"), null, 20),
  new ConditionL(SDQL_OperatorName("l"), null, 30),
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

  public accountBalances = new Array<IEVMBalance>(
    {
      ticker: TickerSymbol("ETH"),
      chainId: ChainId(1),
      accountAddress: EVMAccountAddress("GOOD1"),
      balance: BigNumberString("9"),
      contractAddress: EVMContractAddress("Contract 1"),
      quoteBalance: 0,
    },
    {
      ticker: TickerSymbol("SOL"),
      chainId: ChainId(2),
      accountAddress: EVMAccountAddress("GOOD2"),
      balance: BigNumberString("44"),
      contractAddress: EVMContractAddress("Contract 2"),
      quoteBalance: 0,
    },
    {
      ticker: TickerSymbol("AVAX"),
      chainId: ChainId(3),
      accountAddress: EVMAccountAddress("GOOD3"),
      balance: BigNumberString("117"),
      contractAddress: EVMContractAddress("Contract 3"),
      quoteBalance: 0,
    },
    {
      ticker: TickerSymbol("BIT"),
      chainId: ChainId(4),
      accountAddress: EVMAccountAddress("GOOD4"),
      balance: BigNumberString("903"),
      contractAddress: EVMContractAddress("Contract 4"),
      quoteBalance: 0,
    },
    {
      ticker: TickerSymbol("ADA"),
      chainId: ChainId(5),
      accountAddress: EVMAccountAddress("GOOD5"),
      balance: BigNumberString("24"),
      contractAddress: EVMContractAddress("Contract 10"),
      quoteBalance: 0,
    },
  );

  public constructor() {
    this.dataWalletPersistence.setAge(Age(25));
    //this.dataWalletPersistence.setLocation(CountryCode("US"));
    td.when(this.dataWalletPersistence.getAge()).thenReturn(okAsync(Age(25)));

    td.when(this.dataWalletPersistence.getGender()).thenReturn(
      okAsync(Gender("male")),
    );

    td.when(this.dataWalletPersistence.getSiteVisitsMap()).thenReturn(
      okAsync(this.URLmap),
    );
    /*
    td.when(this.dataWalletPersistence.getTransactionsArray()).thenReturn(
      okAsync(this.transactionsMap),
    );
    */
    td.when(this.dataWalletPersistence.getAccountBalances()).thenReturn(
      okAsync(this.accountBalances),
    );
  }

  public factory() {
    return new BalanceQueryEvaluator(this.dataWalletPersistence);
  }
}

describe("BalanceQueryEvaluator", () => {
  test("3 EVMBalances, Different Contract Addresses", async () => {
    const balanceQuery = new AST_BalanceQuery(
      SDQL_Name("q7"),
      "array",
      null, // * - for all, use null
      [],
    );

    const mocks = new BalanceQueryEvaluatorMocks();
    td.when(mocks.dataWalletPersistence.getAccountBalances()).thenReturn(
      okAsync(
        new Array<IEVMBalance>(
          {
            ticker: TickerSymbol("ETH"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD1"),
            balance: BigNumberString("15"),
            contractAddress: EVMContractAddress("Contract 1"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("SOL"),
            chainId: ChainId(2),
            accountAddress: EVMAccountAddress("GOOD2"),
            balance: BigNumberString("25"),
            contractAddress: EVMContractAddress("Contract 2"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("AVAX"),
            chainId: ChainId(3),
            accountAddress: EVMAccountAddress("GOOD3"),
            balance: BigNumberString("30"),
            contractAddress: EVMContractAddress("Contract 3"),
            quoteBalance: 0,
          },
        ),
      ),
    );
    const repo = mocks.factory();

    const result = await repo.eval(balanceQuery);
    console.log(result);
    expect(result["value"][0]["address"]).toEqual("Contract 1");
    expect(result["value"][0]["networkId"]).toEqual(1);
    expect(result["value"][0]["balance"]).toEqual("15");

    expect(result["value"][1]["address"]).toEqual("Contract 2");
    expect(result["value"][1].networkId).toEqual(2);
    expect(result["value"][1]["balance"]).toEqual("25");

    expect(result["value"][2]["address"]).toEqual("Contract 3");
    expect(result["value"][2].networkId).toEqual(3);
    expect(result["value"][2]["balance"]).toEqual("30");
  });

  test("3 EVMBalances, Same Contract Addresses", async () => {
    const balanceQuery = new AST_BalanceQuery(
      SDQL_Name("q7"),
      "array",
      null, // * - for all, use null
      [],
    );

    const mocks = new BalanceQueryEvaluatorMocks();
    td.when(mocks.dataWalletPersistence.getAccountBalances()).thenReturn(
      okAsync(
        new Array<IEVMBalance>(
          {
            ticker: TickerSymbol("ETH"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD1"),
            balance: BigNumberString("15"),
            contractAddress: EVMContractAddress("Contract 1"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("SOL"),
            chainId: ChainId(2),
            accountAddress: EVMAccountAddress("GOOD2"),
            balance: BigNumberString("25"),
            contractAddress: EVMContractAddress("Contract 1"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("AVAX"),
            chainId: ChainId(3),
            accountAddress: EVMAccountAddress("GOOD3"),
            balance: BigNumberString("30"),
            contractAddress: EVMContractAddress("Contract 1"),
            quoteBalance: 0,
          },
        ),
      ),
    );
    const repo = mocks.factory();

    const result = await repo.eval(balanceQuery);
    //console.log(result);
    expect(result["value"].length).toEqual(1);
    expect(result["value"][0].ticker).toEqual("ETH");
    expect(result["value"][0]["address"]).toEqual("Contract 1");
    expect(result["value"][0].networkId).toEqual(1);
    expect(result["value"][0]["balance"]).toEqual("70");

    // TODO this is conceptually incorrect as different contract address will have different ticket symbols.
  });

  test("2 EVMBalances, Different Contract Addresses", async () => {
    const balanceQuery = new AST_BalanceQuery(
      SDQL_Name("q7"),
      "array",
      null, // * - for all, use null
      [],
    );

    const mocks = new BalanceQueryEvaluatorMocks();
    td.when(mocks.dataWalletPersistence.getAccountBalances()).thenReturn(
      okAsync(
        new Array<IEVMBalance>(
          {
            ticker: TickerSymbol("ETH"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD1"),
            balance: BigNumberString("9"),
            contractAddress: EVMContractAddress("Contract 1"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("SOL"),
            chainId: ChainId(2),
            accountAddress: EVMAccountAddress("GOOD2"),
            balance: BigNumberString("44"),
            contractAddress: EVMContractAddress("Contract 2"),
            quoteBalance: 0,
          },
        ),
      ),
    );
    const repo = mocks.factory();

    const result = await repo.eval(balanceQuery);
    //console.log(result);
    expect(result["value"].length).toEqual(2);
    expect(result["value"][0].ticker).toEqual("ETH");
    expect(result["value"][0]["address"]).toEqual("Contract 1");
    expect(result["value"][0].networkId).toEqual(1);
    expect(result["value"][0]["balance"]).toEqual("9");

    expect(result["value"][1].ticker).toEqual("SOL");
    expect(result["value"][1]["address"]).toEqual("Contract 2");
    expect(result["value"][1].networkId).toEqual(2);
    expect(result["value"][1]["balance"]).toEqual("44");
  });

  test("2 EVMBalances, Same Contract Addresses", async () => {
    const balanceQuery = new AST_BalanceQuery(
      SDQL_Name("q7"),
      "array",
      null, // * - for all, use null
      [],
    );

    const mocks = new BalanceQueryEvaluatorMocks();
    td.when(mocks.dataWalletPersistence.getAccountBalances()).thenReturn(
      okAsync(
        new Array<IEVMBalance>(
          {
            ticker: TickerSymbol("ETH"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD1"),
            balance: BigNumberString("9"),
            contractAddress: EVMContractAddress("Contract 1"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("SOL"),
            chainId: ChainId(2),
            accountAddress: EVMAccountAddress("GOOD2"),
            balance: BigNumberString("44"),
            contractAddress: EVMContractAddress("Contract 1"),
            quoteBalance: 0,
          },
        ),
      ),
    );
    const repo = mocks.factory();

    const result = await repo.eval(balanceQuery);
    //console.log(result);
    expect(result["value"].length).toEqual(1);
    expect(result["value"][0].ticker).toEqual("ETH");
    expect(result["value"][0]["address"]).toEqual("Contract 1");
    expect(result["value"][0].networkId).toEqual(1);
    expect(result["value"][0]["balance"]).toEqual("53");
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
        new Array<IEVMBalance>(
          {
            ticker: TickerSymbol("ETH"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD1"),
            balance: BigNumberString("9"),
            contractAddress: EVMContractAddress("Contract 1"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("SOL"),
            chainId: ChainId(2),
            accountAddress: EVMAccountAddress("GOOD2"),
            balance: BigNumberString("44"),
            contractAddress: EVMContractAddress("Contract 2"),
            quoteBalance: 0,
          },
        ),
      ),
    );
    const repo = mocks.factory();

    const result = await repo.eval(balanceQuery);
    //console.log(result);
    expect(result["value"].length).toEqual(1);
    expect(result["value"][0]["address"]).toEqual("Contract 1");
    expect(result["value"][0].networkId).toEqual(1);
    expect(result["value"][0]["balance"]).toEqual("9");
  });

  test("Only Accept ChainId(1) EVMBalances - Same ContractAddresses", async () => {
    const balanceQuery = new AST_BalanceQuery(
      SDQL_Name("q7"),
      "array",
      ChainId(1),
      [],
    );
    // >= 20 and < 30
    const mocks = new BalanceQueryEvaluatorMocks();
    const repo = mocks.factory();

    td.when(mocks.dataWalletPersistence.getAccountBalances()).thenReturn(
      okAsync(
        new Array<IEVMBalance>(
          {
            ticker: TickerSymbol("ETH"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD1"),
            balance: BigNumberString("10"),
            contractAddress: EVMContractAddress("Contract 1"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("SOL"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD2"),
            balance: BigNumberString("10"),
            contractAddress: EVMContractAddress("Contract 1"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("AVAX"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD3"),
            balance: BigNumberString("10"),
            contractAddress: EVMContractAddress("Contract 1"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("BIT"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD4"),
            balance: BigNumberString("10"),
            contractAddress: EVMContractAddress("Contract 1"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("ADA"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD5"),
            balance: BigNumberString("10"),
            contractAddress: EVMContractAddress("Contract 1"),
            quoteBalance: 0,
          },
        ),
      ),
    );

    const result = await repo.eval(balanceQuery);
    //console.log(result);
    expect(result["value"].length).toEqual(1);
    expect(result["value"][0]["balance"]).toEqual("50");
  });

  test("(Chain ID: 1) && (20 <= Balance < 30) - ALL VALUES", async () => {
    const balanceQuery = new AST_BalanceQuery(
      SDQL_Name("q7"),
      "array",
      ChainId(1),
      conditionsGEandL,
    );
    // >= 20 and < 30
    const mocks = new BalanceQueryEvaluatorMocks();
    const repo = mocks.factory();

    td.when(mocks.dataWalletPersistence.getAccountBalances()).thenReturn(
      okAsync(
        new Array<IEVMBalance>(
          {
            ticker: TickerSymbol("ETH"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD1"),
            balance: BigNumberString("23"),
            contractAddress: EVMContractAddress("Contract 1"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("ETH"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD2"),
            balance: BigNumberString("25"),
            contractAddress: EVMContractAddress("Contract 2"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("ETH"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD2"),
            balance: BigNumberString("27"),
            contractAddress: EVMContractAddress("Contract 3"),
            quoteBalance: 0,
          },
        ),
      ),
    );

    const result = await repo.eval(balanceQuery);
    //console.log(result);
    expect(result["value"].length).toEqual(3);
    expect(result["value"][0]["address"]).toEqual("Contract 1");
    expect(result["value"][0].networkId).toEqual(1);
    expect(result["value"][0]["balance"]).toEqual("23");

    expect(result["value"][1]["address"]).toEqual("Contract 2");
    expect(result["value"][1].networkId).toEqual(1);
    expect(result["value"][1]["balance"]).toEqual("25");

    expect(result["value"][2]["address"]).toEqual("Contract 3");
    expect(result["value"][2].networkId).toEqual(1);
    expect(result["value"][2]["balance"]).toEqual("27");
  });

  test("(Chain ID: 1) && (20 <= Balance < 30) - Only One Value Passes", async () => {
    const balanceQuery = new AST_BalanceQuery(
      SDQL_Name("q7"),
      "array",
      ChainId(1),
      conditionsGEandL,
    );
    // >= 20 and < 30
    const mocks = new BalanceQueryEvaluatorMocks();
    const repo = mocks.factory();

    td.when(mocks.dataWalletPersistence.getAccountBalances()).thenReturn(
      okAsync(
        new Array<IEVMBalance>(
          {
            ticker: TickerSymbol("ETH"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD1"),
            balance: BigNumberString("19"),
            contractAddress: EVMContractAddress("Contract 1"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("ETH"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD2"),
            balance: BigNumberString("25"),
            contractAddress: EVMContractAddress("Contract 2"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("ETH"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD2"),
            balance: BigNumberString("31"),
            contractAddress: EVMContractAddress("Contract 3"),
            quoteBalance: 0,
          },
        ),
      ),
    );

    const result = await repo.eval(balanceQuery);
    //console.log(result);
    expect(result["value"].length).toEqual(1);
    expect(result["value"][0]["address"]).toEqual("Contract 2");
    expect(result["value"][0].networkId).toEqual(1);
    expect(result["value"][0]["balance"]).toEqual("25");
  });

  test("(Chain ID: 1) & (20 <= Balance < 30) - Add all of the values", async () => {
    const balanceQuery = new AST_BalanceQuery(
      SDQL_Name("q7"),
      "array",
      ChainId(1),
      conditionsGEandL,
    );
    // >= 20 and < 30
    const mocks = new BalanceQueryEvaluatorMocks();
    const repo = mocks.factory();

    td.when(mocks.dataWalletPersistence.getAccountBalances()).thenReturn(
      okAsync(
        new Array<IEVMBalance>(
          {
            ticker: TickerSymbol("ETH"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD1"),
            balance: BigNumberString("23"),
            contractAddress: EVMContractAddress("Contract 1"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("ETH"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD2"),
            balance: BigNumberString("25"),
            contractAddress: EVMContractAddress("Contract 1"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("ETH"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD2"),
            balance: BigNumberString("27"),
            contractAddress: EVMContractAddress("Contract 1"),
            quoteBalance: 0,
          },
        ),
      ),
    );

    const result = await repo.eval(balanceQuery);
    //console.log(result);
    expect(result["value"].length).toEqual(1);
    expect(result["value"][0]["address"]).toEqual("Contract 1");
    expect(result["value"][0].networkId).toEqual(1);
    expect(result["value"][0]["balance"]).toEqual("75");
  });

  test("(Chain ID: 1) & (20 <= Balance < 30) - Add first two values, the only ones that match conditions", async () => {
    const balanceQuery = new AST_BalanceQuery(
      SDQL_Name("q7"),
      "array",
      ChainId(1),
      conditionsGEandL,
    );
    // >= 20 and < 30
    const mocks = new BalanceQueryEvaluatorMocks();
    const repo = mocks.factory();

    td.when(mocks.dataWalletPersistence.getAccountBalances()).thenReturn(
      okAsync(
        new Array<IEVMBalance>(
          {
            ticker: TickerSymbol("ETH"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD1"),
            balance: BigNumberString("19"),
            contractAddress: EVMContractAddress("Contract 1"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("ETH"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD2"),
            balance: BigNumberString("25"),
            contractAddress: EVMContractAddress("Contract 2"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("ETH"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD2"),
            balance: BigNumberString("31"),
            contractAddress: EVMContractAddress("Contract 3"),
            quoteBalance: 0,
          },
        ),
      ),
    );

    const result = await repo.eval(balanceQuery);
    //console.log(result);
    expect(result["value"].length).toEqual(1);
    expect(result["value"][0].address).toEqual("Contract 2");
    expect(result["value"][0].networkId).toEqual(1);
    expect(result["value"][0].balance).toEqual("25");
  });

  test("(Chain ID: 1) & (20 <= Balance < 30) - Add all of the values", async () => {
    const balanceQuery = new AST_BalanceQuery(
      SDQL_Name("q7"),
      "array",
      ChainId(1),
      conditionsGEandL,
    );
    // >= 20 and < 30
    const mocks = new BalanceQueryEvaluatorMocks();
    const repo = mocks.factory();

    td.when(mocks.dataWalletPersistence.getAccountBalances()).thenReturn(
      okAsync(
        new Array<IEVMBalance>(
          {
            ticker: TickerSymbol("ETH"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD1"),
            balance: BigNumberString("23"),
            contractAddress: EVMContractAddress("Contract 1"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("ETH"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD2"),
            balance: BigNumberString("25"),
            contractAddress: EVMContractAddress("Contract 1"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("ETH"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD2"),
            balance: BigNumberString("27"),
            contractAddress: EVMContractAddress("Contract 1"),
            quoteBalance: 0,
          },
        ),
      ),
    );

    const result = await repo.eval(balanceQuery);
    //console.log(result);
    expect(result["value"].length).toEqual(1);
    expect(result["value"][0].address).toEqual("Contract 1");
    expect(result["value"][0].networkId).toEqual(1);
    expect(result["value"][0].balance).toEqual("75");
  });

  test("(Chain ID: 1) & (20 <= Balance < 30) - Add first two values, the only ones that match conditions", async () => {
    const balanceQuery = new AST_BalanceQuery(
      SDQL_Name("q7"),
      "array",
      ChainId(1),
      conditionsGEandL,
    );
    // >= 20 and < 30
    const mocks = new BalanceQueryEvaluatorMocks();
    const repo = mocks.factory();

    td.when(mocks.dataWalletPersistence.getAccountBalances()).thenReturn(
      okAsync(
        new Array<IEVMBalance>(
          {
            ticker: TickerSymbol("ETH"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD1"),
            balance: BigNumberString("25"),
            contractAddress: EVMContractAddress("Contract 1"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("ETH"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD2"),
            balance: BigNumberString("25"),
            contractAddress: EVMContractAddress("Contract 1"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("ETH"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD2"),
            balance: BigNumberString("100"),
            contractAddress: EVMContractAddress("Contract 1"),
            quoteBalance: 0,
          },
        ),
      ),
    );

    const result = await repo.eval(balanceQuery);
    //console.log(result);
    expect(result["value"].length).toEqual(1);
    expect(result["value"][0]["address"]).toEqual("Contract 1");
    expect(result["value"][0].networkId).toEqual(1);
    expect(result["value"][0]["balance"]).toEqual("50");
  });

  test("(Chain ID: 1) & (20 < Balance <= 30)", async () => {
    const balanceQuery = new AST_BalanceQuery(
      SDQL_Name("q7"),
      "array",
      ChainId(1), // * - for all, use null
      conditionsGandLE,
    );
    // >= 20 and < 30
    const mocks = new BalanceQueryEvaluatorMocks();
    const repo = mocks.factory();

    td.when(mocks.dataWalletPersistence.getAccountBalances()).thenReturn(
      okAsync(
        new Array<IEVMBalance>(
          {
            ticker: TickerSymbol("ETH"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD1"),
            balance: BigNumberString("9"),
            contractAddress: EVMContractAddress("Contract 1"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("ETH"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD2"),
            balance: BigNumberString("29"),
            contractAddress: EVMContractAddress("Contract 1"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("AVAX"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD3"),
            balance: BigNumberString("24"),
            contractAddress: EVMContractAddress("Contract 2"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("AVAX"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD3"),
            balance: BigNumberString("51"),
            contractAddress: EVMContractAddress("Contract 2"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("AVAX"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD3"),
            balance: BigNumberString("1002"),
            contractAddress: EVMContractAddress("Contract 3"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("AVAX"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD3"),
            balance: BigNumberString("23"),
            contractAddress: EVMContractAddress("Contract 3"),
            quoteBalance: 0,
          },
        ),
      ),
    );

    const result = await repo.eval(balanceQuery);
    //console.log(result);
    expect(result["value"].length).toEqual(3);
    expect(result["value"][0]["address"]).toEqual("Contract 1");
    expect(result["value"][0].networkId).toEqual(1);
    expect(result["value"][0]["balance"]).toEqual("29");

    expect(result["value"][1]["address"]).toEqual("Contract 2");
    expect(result["value"][1].networkId).toEqual(1);
    expect(result["value"][1]["balance"]).toEqual("24");

    expect(result["value"][2]["address"]).toEqual("Contract 3");
    expect(result["value"][2].networkId).toEqual(1);
    expect(result["value"][2]["balance"]).toEqual("23");
  });

  test("(Chain ID: 1) & (Balance == 29) - one occurence", async () => {
    const balanceQuery = new AST_BalanceQuery(
      SDQL_Name("q7"),
      "array",
      ChainId(1), // * - for all, use null
      conditionsE,
    );
    // >= 20 and < 30
    const mocks = new BalanceQueryEvaluatorMocks();
    const repo = mocks.factory();

    td.when(mocks.dataWalletPersistence.getAccountBalances()).thenReturn(
      okAsync(
        new Array<IEVMBalance>(
          {
            ticker: TickerSymbol("ETH"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD1"),
            balance: BigNumberString("9"),
            contractAddress: EVMContractAddress("Contract 1"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("ETH"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD2"),
            balance: BigNumberString("44"),
            contractAddress: EVMContractAddress("Contract 2"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("ETH"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD2"),
            balance: BigNumberString("29"),
            contractAddress: EVMContractAddress("Contract 2"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("AVAX"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD3"),
            balance: BigNumberString("11"),
            contractAddress: EVMContractAddress("Contract 4"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("AVAX"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD3"),
            balance: BigNumberString("24"),
            contractAddress: EVMContractAddress("Contract 4"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("AVAX"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD3"),
            balance: BigNumberString("51"),
            contractAddress: EVMContractAddress("Contract 4"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("AVAX"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD3"),
            balance: BigNumberString("1002"),
            contractAddress: EVMContractAddress("Contract 5"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("AVAX"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD3"),
            balance: BigNumberString("23"),
            contractAddress: EVMContractAddress("Contract 5"),
            quoteBalance: 0,
          },
        ),
      ),
    );

    const result = await repo.eval(balanceQuery);
    // console.log(result);
    expect(result["value"].length).toEqual(1);
    expect(result["value"][0]["address"]).toEqual("Contract 2");
    expect(result["value"][0].networkId).toEqual(1);
    expect(result["value"][0]["balance"]).toEqual("29");
  });

  test("(Chain ID: 1) & (Balance == 29) - multiple occurences", async () => {
    const balanceQuery = new AST_BalanceQuery(
      SDQL_Name("q7"),
      "array",
      ChainId(1), // * - for all, use null
      conditionsE,
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

    const result = await repo.eval(balanceQuery);
    console.log(result);
    expect(result["value"].length).toEqual(1);
    expect(result["value"][0]["address"]).toEqual("Contract 2");
    expect(result["value"][0].networkId).toEqual(1);
    expect(result["value"][0]["balance"]).toEqual("58");
  });

  test("(Chain ID: 0) - should return no values", async () => {
    const balanceQuery = new AST_BalanceQuery(
      SDQL_Name("q7"),
      "array",
      ChainId(0), // * - for all, use null
      conditionsE,
    );
    // >= 20 and < 30
    const mocks = new BalanceQueryEvaluatorMocks();
    const repo = mocks.factory();

    td.when(mocks.dataWalletPersistence.getAccountBalances()).thenReturn(
      okAsync(
        new Array<IEVMBalance>(
          {
            ticker: TickerSymbol("ETH"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD1"),
            balance: BigNumberString("9"),
            contractAddress: EVMContractAddress("Contract 1"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("ETH"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD2"),
            balance: BigNumberString("44"),
            contractAddress: EVMContractAddress("Contract 2"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("ETH"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD2"),
            balance: BigNumberString("29"),
            contractAddress: EVMContractAddress("Contract 2"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("AVAX"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD3"),
            balance: BigNumberString("11"),
            contractAddress: EVMContractAddress("Contract 4"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("AVAX"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD3"),
            balance: BigNumberString("24"),
            contractAddress: EVMContractAddress("Contract 4"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("AVAX"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD3"),
            balance: BigNumberString("51"),
            contractAddress: EVMContractAddress("Contract 4"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("AVAX"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD3"),
            balance: BigNumberString("1002"),
            contractAddress: EVMContractAddress("Contract 5"),
            quoteBalance: 0,
          },
          {
            ticker: TickerSymbol("AVAX"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD3"),
            balance: BigNumberString("23"),
            contractAddress: EVMContractAddress("Contract 5"),
            quoteBalance: 0,
          },
        ),
      ),
    );

    const result = await repo.eval(balanceQuery);
    // console.log(result);
    expect(result["value"].length).toEqual(0);
  });
});
