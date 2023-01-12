import "reflect-metadata";

import {
  IDataWalletPersistence,
  TokenBalance,
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
  EChainTechnology,
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

  public accountBalances = new Array<TokenBalance>(
    new TokenBalance(
      EChainTechnology.EVM,
      TickerSymbol("ETH"),
      ChainId(1),
      EVMContractAddress("Contract 1"),
      EVMAccountAddress("GOOD1"),
      BigNumberString("9"),
      18,
    ),
    new TokenBalance(
      EChainTechnology.EVM,
      TickerSymbol("SOL"),
      ChainId(2),
      EVMContractAddress("Contract 2"),
      EVMAccountAddress("GOOD2"),
      BigNumberString("44"),
      18,
    ),
    new TokenBalance(
      EChainTechnology.EVM,
      TickerSymbol("AVAX"),
      ChainId(3),
      EVMContractAddress("Contract 3"),
      EVMAccountAddress("GOOD3"),
      BigNumberString("117"),
      18,
    ),
    new TokenBalance(
      EChainTechnology.EVM,
      TickerSymbol("BIT"),
      ChainId(4),
      EVMContractAddress("Contract 4"),
      EVMAccountAddress("GOOD4"),
      BigNumberString("903"),
      18,
    ),
    new TokenBalance(
      EChainTechnology.EVM,
      TickerSymbol("ADA"),
      ChainId(5),
      EVMContractAddress("Contract 10"),
      EVMAccountAddress("GOOD5"),
      BigNumberString("24"),
      18,
    ),
  );

  public constructor() {
    //this.dataWalletPersistence.setLocation(CountryCode("US"));
    td.when(this.dataWalletPersistence.getAge()).thenReturn(okAsync(Age(25)));

    td.when(this.dataWalletPersistence.getGender()).thenReturn(
      okAsync(Gender("male")),
    );

    td.when(this.dataWalletPersistence.getSiteVisitsMap()).thenReturn(
      okAsync(this.URLmap),
    );
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
        new Array<TokenBalance>(
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("ETH"),
            ChainId(1),
            EVMContractAddress("Contract 1"),
            EVMAccountAddress("GOOD1"),
            BigNumberString("15"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("SOL"),
            ChainId(2),
            EVMContractAddress("Contract 2"),
            EVMAccountAddress("GOOD2"),
            BigNumberString("25"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("AVAX"),
            ChainId(3),
            EVMContractAddress("Contract 3"),
            EVMAccountAddress("GOOD3"),
            BigNumberString("30"),
            18,
          ),
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
        new Array<TokenBalance>(
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("ETH"),
            ChainId(1),
            EVMContractAddress("Contract 1"),
            EVMAccountAddress("GOOD1"),
            BigNumberString("15"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("SOL"),
            ChainId(2),
            EVMContractAddress("Contract 2"),
            EVMAccountAddress("GOOD2"),
            BigNumberString("25"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("AVAX"),
            ChainId(3),
            EVMContractAddress("Contract 3"),
            EVMAccountAddress("GOOD3"),
            BigNumberString("30"),
            18,
          ),
        ),
      ),
    );
    const repo = mocks.factory();

    const result = await repo.eval(balanceQuery);
    //console.log(result);
    expect(result["value"].length).toEqual(1);
    expect(result["value"][0].ticker).toEqual("ETH");
    expect(result["value"][0].tokenAddress).toEqual("Contract 1");
    expect(result["value"][0].chainId).toEqual(1);
    expect(result["value"][0].balance).toEqual("70");

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
        new Array<TokenBalance>(
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("ETH"),
            ChainId(1),
            EVMContractAddress("Contract 1"),
            EVMAccountAddress("GOOD1"),
            BigNumberString("9"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("SOL"),
            ChainId(2),
            EVMContractAddress("Contract 2"),
            EVMAccountAddress("GOOD2"),
            BigNumberString("44"),
            18,
          ),
        ),
      ),
    );
    const repo = mocks.factory();

    const result = await repo.eval(balanceQuery);
    //console.log(result);
    expect(result["value"].length).toEqual(2);
    expect(result["value"][0].ticker).toEqual("ETH");
    expect(result["value"][0].tokenAddress).toEqual("Contract 1");
    expect(result["value"][0].chainId).toEqual(1);
    expect(result["value"][0].balance).toEqual("9");

    expect(result["value"][1].ticker).toEqual("SOL");
    expect(result["value"][1].tokenAddress).toEqual("Contract 2");
    expect(result["value"][1].chainId).toEqual(2);
    expect(result["value"][1].balance).toEqual("44");
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
        new Array<TokenBalance>(
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("ETH"),
            ChainId(1),
            EVMContractAddress("Contract 1"),
            EVMAccountAddress("GOOD1"),
            BigNumberString("9"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("SOL"),
            ChainId(2),
            EVMContractAddress("Contract 2"),
            EVMAccountAddress("GOOD2"),
            BigNumberString("44"),
            18,
          ),
        ),
      ),
    );
    const repo = mocks.factory();

    const result = await repo.eval(balanceQuery);
    //console.log(result);
    expect(result["value"].length).toEqual(1);
    expect(result["value"][0].ticker).toEqual("ETH");
    expect(result["value"][0].tokenAddress).toEqual("Contract 1");
    expect(result["value"][0].chainId).toEqual(1);
    expect(result["value"][0].balance).toEqual("53");
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
        new Array<TokenBalance>(
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("ETH"),
            ChainId(1),
            EVMContractAddress("Contract 1"),
            EVMAccountAddress("GOOD1"),
            BigNumberString("9"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("SOL"),
            ChainId(2),
            EVMContractAddress("Contract 2"),
            EVMAccountAddress("GOOD2"),
            BigNumberString("44"),
            18,
          ),
        ),
      ),
    );
    const repo = mocks.factory();

    const result = await repo.eval(balanceQuery);
    //console.log(result);
    expect(result["value"].length).toEqual(1);
    expect(result["value"][0].tokenAddress).toEqual("Contract 1");
    expect(result["value"][0].chainId).toEqual(1);
    expect(result["value"][0].balance).toEqual("9");
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
        new Array<TokenBalance>(
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("ETH"),
            ChainId(1),
            EVMContractAddress("Contract 1"),
            EVMAccountAddress("GOOD1"),
            BigNumberString("9"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("SOL"),
            ChainId(2),
            EVMContractAddress("Contract 2"),
            EVMAccountAddress("GOOD2"),
            BigNumberString("44"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("AVAX"),
            ChainId(3),
            EVMContractAddress("Contract 3"),
            EVMAccountAddress("GOOD3"),
            BigNumberString("117"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("BIT"),
            ChainId(4),
            EVMContractAddress("Contract 4"),
            EVMAccountAddress("GOOD4"),
            BigNumberString("903"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("ADA"),
            ChainId(5),
            EVMContractAddress("Contract 10"),
            EVMAccountAddress("GOOD5"),
            BigNumberString("24"),
            18,
          ),
        ),
      ),
    );

    const result = await repo.eval(balanceQuery);
    //console.log(result);
    expect(result["value"].length).toEqual(1);
    expect(result["value"][0].balance).toEqual("50");
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
        new Array<TokenBalance>(
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("ETH"),
            ChainId(1),
            EVMContractAddress("Contract 1"),
            EVMAccountAddress("GOOD1"),
            BigNumberString("23"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("ETH"),
            ChainId(1),
            EVMContractAddress("Contract 2"),
            EVMAccountAddress("GOOD2"),
            BigNumberString("25"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("ETH"),
            ChainId(1),
            EVMContractAddress("Contract 3"),
            EVMAccountAddress("GOOD2"),
            BigNumberString("27"),
            18,
          ),
        ),
      ),
    );

    const result = await repo.eval(balanceQuery);
    //console.log(result);
    expect(result["value"].length).toEqual(3);
    expect(result["value"][0].tokenAddress).toEqual("Contract 1");
    expect(result["value"][0].chainId).toEqual(1);
    expect(result["value"][0].balance).toEqual("23");

    expect(result["value"][1].tokenAddress).toEqual("Contract 2");
    expect(result["value"][1].chainId).toEqual(1);
    expect(result["value"][1].balance).toEqual("25");

    expect(result["value"][2].tokenAddress).toEqual("Contract 3");
    expect(result["value"][2].chainId).toEqual(1);
    expect(result["value"][2].balance).toEqual("27");
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
        new Array<TokenBalance>(
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("ETH"),
            ChainId(1),
            EVMContractAddress("Contract 1"),
            EVMAccountAddress("GOOD1"),
            BigNumberString("19"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("ETH"),
            ChainId(1),
            EVMContractAddress("Contract 2"),
            EVMAccountAddress("GOOD2"),
            BigNumberString("25"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("ETH"),
            ChainId(1),
            EVMContractAddress("Contract 3"),
            EVMAccountAddress("GOOD2"),
            BigNumberString("31"),
            18,
          ),
        ),
      ),
    );

    const result = await repo.eval(balanceQuery);
    //console.log(result);
    expect(result["value"].length).toEqual(1);
    expect(result["value"][0].tokenAddress).toEqual("Contract 2");
    expect(result["value"][0].chainId).toEqual(1);
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
        new Array<TokenBalance>(
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("ETH"),
            ChainId(1),
            EVMContractAddress("Contract 1"),
            EVMAccountAddress("GOOD1"),
            BigNumberString("23"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("ETH"),
            ChainId(1),
            EVMContractAddress("Contract 2"),
            EVMAccountAddress("GOOD2"),
            BigNumberString("25"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("ETH"),
            ChainId(1),
            EVMContractAddress("Contract 3"),
            EVMAccountAddress("GOOD2"),
            BigNumberString("27"),
            18,
          ),
        ),
      ),
    );

    const result = await repo.eval(balanceQuery);
    //console.log(result);
    expect(result["value"].length).toEqual(1);
    expect(result["value"][0].tokenAddress).toEqual("Contract 1");
    expect(result["value"][0].chainId).toEqual(1);
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
        new Array<TokenBalance>(
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("ETH"),
            ChainId(1),
            EVMContractAddress("Contract 1"),
            EVMAccountAddress("GOOD1"),
            BigNumberString("19"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("ETH"),
            ChainId(1),
            EVMContractAddress("Contract 2"),
            EVMAccountAddress("GOOD2"),
            BigNumberString("25"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("ETH"),
            ChainId(1),
            EVMContractAddress("Contract 3"),
            EVMAccountAddress("GOOD2"),
            BigNumberString("31"),
            18,
          ),
        ),
      ),
    );

    const result = await repo.eval(balanceQuery);
    //console.log(result);
    expect(result["value"].length).toEqual(1);
    expect(result["value"][0].tokenAddress).toEqual("Contract 2");
    expect(result["value"][0].chainId).toEqual(1);
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
        new Array<TokenBalance>(
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("ETH"),
            ChainId(1),
            EVMContractAddress("Contract 1"),
            EVMAccountAddress("GOOD1"),
            BigNumberString("23"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("ETH"),
            ChainId(1),
            EVMContractAddress("Contract 1"),
            EVMAccountAddress("GOOD2"),
            BigNumberString("25"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("ETH"),
            ChainId(1),
            EVMContractAddress("Contract 1"),
            EVMAccountAddress("GOOD2"),
            BigNumberString("27"),
            18,
          ),
        ),
      ),
    );

    const result = await repo.eval(balanceQuery);
    //console.log(result);
    expect(result["value"].length).toEqual(1);
    expect(result["value"][0].tokenAddress).toEqual("Contract 1");
    expect(result["value"][0].chainId).toEqual(1);
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
        new Array<TokenBalance>(
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("ETH"),
            ChainId(1),
            EVMContractAddress("Contract 1"),
            EVMAccountAddress("GOOD1"),
            BigNumberString("25"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("ETH"),
            ChainId(1),
            EVMContractAddress("Contract 1"),
            EVMAccountAddress("GOOD2"),
            BigNumberString("25"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("ETH"),
            ChainId(1),
            EVMContractAddress("Contract 1"),
            EVMAccountAddress("GOOD2"),
            BigNumberString("100"),
            18,
          ),
        ),
      ),
    );

    const result = await repo.eval(balanceQuery);
    //console.log(result);
    expect(result["value"].length).toEqual(1);
    expect(result["value"][0].tokenAddress).toEqual("Contract 1");
    expect(result["value"][0].chainId).toEqual(1);
    expect(result["value"][0].balance).toEqual("50");
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
        new Array<TokenBalance>(
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("ETH"),
            ChainId(1),
            EVMContractAddress("Contract 1"),
            EVMAccountAddress("GOOD1"),
            BigNumberString("9"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("ETH"),
            ChainId(1),
            EVMContractAddress("Contract 1"),
            EVMAccountAddress("GOOD2"),
            BigNumberString("29"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("AVAX"),
            ChainId(1),
            EVMContractAddress("Contract 2"),
            EVMAccountAddress("GOOD3"),
            BigNumberString("24"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("AVAX"),
            ChainId(1),
            EVMContractAddress("Contract 2"),
            EVMAccountAddress("GOOD3"),
            BigNumberString("51"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("AVAX"),
            ChainId(1),
            EVMContractAddress("Contract 3"),
            EVMAccountAddress("GOOD3"),
            BigNumberString("1002"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("AVAX"),
            ChainId(1),
            EVMContractAddress("Contract 3"),
            EVMAccountAddress("GOOD3"),
            BigNumberString("23"),
            18,
          ),
        ),
      ),
    );

    const result = await repo.eval(balanceQuery);
    //console.log(result);
    expect(result["value"].length).toEqual(3);
    expect(result["value"][0].tokenAddress).toEqual("Contract 1");
    expect(result["value"][0].chainId).toEqual(1);
    expect(result["value"][0].balance).toEqual("29");

    expect(result["value"][1].tokenAddress).toEqual("Contract 2");
    expect(result["value"][1].chainId).toEqual(1);
    expect(result["value"][1].balance).toEqual("24");

    expect(result["value"][2].tokenAddress).toEqual("Contract 3");
    expect(result["value"][2].chainId).toEqual(1);
    expect(result["value"][2].balance).toEqual("23");
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
        new Array<TokenBalance>(
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("ETH"),
            ChainId(1),
            EVMContractAddress("Contract 1"),
            EVMAccountAddress("GOOD1"),
            BigNumberString("9"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("ETH"),
            ChainId(1),
            EVMContractAddress("Contract 2"),
            EVMAccountAddress("GOOD3"),
            BigNumberString("44"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("ETH"),
            ChainId(1),
            EVMContractAddress("Contract 2"),
            EVMAccountAddress("GOOD2"),
            BigNumberString("29"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("AVAX"),
            ChainId(1),
            EVMContractAddress("Contract 4"),
            EVMAccountAddress("GOOD3"),
            BigNumberString("11"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("AVAX"),
            ChainId(1),
            EVMContractAddress("Contract 4"),
            EVMAccountAddress("GOOD3"),
            BigNumberString("24"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("AVAX"),
            ChainId(1),
            EVMContractAddress("Contract 4"),
            EVMAccountAddress("GOOD3"),
            BigNumberString("51"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("AVAX"),
            ChainId(1),
            EVMContractAddress("Contract 5"),
            EVMAccountAddress("GOOD3"),
            BigNumberString("1002"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("AVAX"),
            ChainId(1),
            EVMContractAddress("Contract 5"),
            EVMAccountAddress("GOOD3"),
            BigNumberString("23"),
            18,
          ),
        ),
      ),
    );

    const result = await repo.eval(balanceQuery);
    // console.log(result);
    expect(result["value"].length).toEqual(1);
    expect(result["value"][0].tokenAddress).toEqual("Contract 2");
    expect(result["value"][0].chainId).toEqual(1);
    expect(result["value"][0].balance).toEqual("29");
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
        new Array<TokenBalance>(
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("ETH"),
            ChainId(1),
            EVMContractAddress("Contract 1"),
            EVMAccountAddress("GOOD1"),
            BigNumberString("9"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("ETH"),
            ChainId(1),
            EVMContractAddress("Contract 2"),
            EVMAccountAddress("GOOD2"),
            BigNumberString("29"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("AVAX"),
            ChainId(1),
            EVMContractAddress("Contract 2"),
            EVMAccountAddress("GOOD3"),
            BigNumberString("29"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("AVAX"),
            ChainId(1),
            EVMContractAddress("Contract 3"),
            EVMAccountAddress("GOOD3"),
            BigNumberString("1000"),
            18,
          ),
        ),
      ),
    );

    const result = await repo.eval(balanceQuery);
    console.log(result);
    expect(result["value"].length).toEqual(1);
    expect(result["value"][0].tokenAddress).toEqual("Contract 2");
    expect(result["value"][0].chainId).toEqual(1);
    expect(result["value"][0].balance).toEqual("58");
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
        new Array<TokenBalance>(
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("ETH"),
            ChainId(1),
            EVMContractAddress("Contract 1"),
            EVMAccountAddress("GOOD1"),
            BigNumberString("9"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("ETH"),
            ChainId(1),
            EVMContractAddress("Contract 2"),
            EVMAccountAddress("GOOD2"),
            BigNumberString("44"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("ETH"),
            ChainId(1),
            EVMContractAddress("Contract 2"),
            EVMAccountAddress("GOOD2"),
            BigNumberString("29"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("AVAX"),
            ChainId(1),
            EVMContractAddress("Contract 4"),
            EVMAccountAddress("GOOD3"),
            BigNumberString("11"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("AVAX"),
            ChainId(1),
            EVMContractAddress("Contract 4"),
            EVMAccountAddress("GOOD3"),
            BigNumberString("24"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("AVAX"),
            ChainId(1),
            EVMContractAddress("Contract 4"),
            EVMAccountAddress("GOOD3"),
            BigNumberString("51"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("AVAX"),
            ChainId(1),
            EVMContractAddress("Contract 5"),
            EVMAccountAddress("GOOD3"),
            BigNumberString("1002"),
            18,
          ),
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol("AVAX"),
            ChainId(1),
            EVMContractAddress("Contract 5"),
            EVMAccountAddress("GOOD3"),
            BigNumberString("23"),
            18,
          ),
        ),
      ),
    );

    const result = await repo.eval(balanceQuery);
    // console.log(result);
    expect(result["value"].length).toEqual(0);
  });
});
