import "reflect-metadata";

import {
  Age,
  BigNumberString,
  ChainId,
  EVMAccountAddress,
  EVMTimestampRange,
  EVMChainCode,
  EVMContractAddress,
  EVMContractDirection,
  EVMContractFunction,
  EVMToken,
  EVMTransaction,
  TransactionFilter,
  Gender,
  IDataWalletPersistence,
  TokenBalance,
  SDQL_Name,
  TickerSymbol,
  UnixTimestamp,
  URLString,
  IChainTransaction,
  EChainTechnology,
  EVMTransactionHash,
} from "@snickerdoodlelabs/objects";
import {
  AST_NetworkQuery,
  AST_Contract,
} from "@snickerdoodlelabs/query-parser";
import { okAsync } from "neverthrow";
import * as td from "testdouble";

import { NetworkQueryEvaluator } from "@core/implementations/business/utilities/query/index.js";
import { IBalanceQueryEvaluator } from "@core/interfaces/business/utilities/query/index.js";

class NetworkQueryEvaluatorMocks {
  public dataWalletPersistence = td.object<IDataWalletPersistence>();
  public balanceQueryEvaluator = td.object<IBalanceQueryEvaluator>();

  public URLmap = new Map<URLString, number>([
    [URLString("www.snickerdoodlelabs.io"), 10],
  ]);

  public transactionsArray = new Array<IChainTransaction>();

  public accountBalances = new Array<TokenBalance>(
    {
      ticker: TickerSymbol("ETH"),
      chainId: ChainId(1),
      accountAddress: EVMAccountAddress("GOOD1"),
      balance: BigNumberString("18"),
      tokenAddress: EVMContractAddress("9dkj13nd"),
      quoteBalance: BigNumberString("0"),
      type: EChainTechnology.EVM,
    },
    {
      ticker: TickerSymbol("ETH"),
      chainId: ChainId(1),
      accountAddress: EVMAccountAddress("GOOD2"),
      balance: BigNumberString("25"),
      tokenAddress: EVMContractAddress("0pemc726"),
      quoteBalance: BigNumberString("0"),
      type: EChainTechnology.EVM,
    },
    {
      ticker: TickerSymbol("BLAH"),
      chainId: ChainId(901398),
      accountAddress: EVMAccountAddress("BAD"),
      balance: BigNumberString("26"),
      tokenAddress: EVMContractAddress("lp20xk3c"),
      quoteBalance: BigNumberString("0"),
      type: EChainTechnology.EVM,
    },
    {
      ticker: TickerSymbol("ETH"),
      chainId: ChainId(1),
      accountAddress: EVMAccountAddress("GOOD3"),
      balance: BigNumberString("36"),
      tokenAddress: EVMContractAddress("m12s93io"),
      quoteBalance: BigNumberString("0"),
      type: EChainTechnology.EVM,
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
      okAsync(this.transactionsArray),
    );
    */
    td.when(this.dataWalletPersistence.getAccountBalances()).thenReturn(
      okAsync(this.accountBalances),
    );
  }

  public factory() {
    return new NetworkQueryEvaluator(this.dataWalletPersistence);
  }
}

describe("QueryEvaluator: ", () => {
  test("Network Query: Return True", async () => {
    const mocks = new NetworkQueryEvaluatorMocks();
    const repo = mocks.factory();

    const networkQuery = new AST_NetworkQuery(
      SDQL_Name("q1"),
      "boolean",
      EVMChainCode("AVAX"),
      new AST_Contract(
        ChainId(43114),
        EVMAccountAddress("0x9366d30feba284e62900f6295bc28c9906f33172"),
        EVMContractFunction("Transfer"),
        EVMContractDirection.From,
        EVMToken("ERC20"),
        new EVMTimestampRange(UnixTimestamp(13001519), UnixTimestamp(14910334)),
      ),
    );
    const chainId = networkQuery.contract.networkId;
    const address = networkQuery.contract.address as EVMAccountAddress;
    const hash = "";
    const startTime = networkQuery.contract.timestamp.start;
    const endTime = networkQuery.contract.timestamp.end;
    // console.log("Address: ", address)
    // console.log("Start Time: ", startTime)
    // console.log("End Time: ", endTime)
    const filter = new TransactionFilter(
      [chainId],
      [address],
      [EVMTransactionHash(hash)],
      startTime,
      endTime,
    );
    td.when(
      mocks.dataWalletPersistence.getTransactions(td.matchers.anything()),
    ).thenReturn(
      okAsync([
        new EVMTransaction(
          ChainId(43114),
          EVMTransactionHash(""),
          UnixTimestamp(13001519),
          null,
          null,
          EVMAccountAddress("0x9366d30feba284e62900f6295bc28c9906f33172"),
          null,
          null,
          null,
          null,
          null,
          0,
        ),
      ]),
    );
    const result = await repo.eval(networkQuery);
    // console.log("Age is: ", result["value"]);
    // console.log(result)
    expect(result).toBeDefined();
    expect(result["value"]).toBe(true);
  });

  test("Network Query: Return True", async () => {
    const mocks = new NetworkQueryEvaluatorMocks();
    const repo = mocks.factory();

    const networkQuery = new AST_NetworkQuery(
      SDQL_Name("q1"),
      "boolean",
      EVMChainCode("AVAX"),
      new AST_Contract(
        ChainId(43114),
        EVMAccountAddress("0x9366d30feba284e62900f6295bc28c9906f33172"),
        EVMContractFunction("Transfer"),
        EVMContractDirection.From,
        EVMToken("ERC20"),
        new EVMTimestampRange(UnixTimestamp(13001519), UnixTimestamp(14910334)),
      ),
    );
    const chainId = networkQuery.contract.networkId;
    const address = networkQuery.contract.address as EVMAccountAddress;
    const hash = "";
    const startTime = networkQuery.contract.timestamp.start;
    const endTime = networkQuery.contract.timestamp.end;

    const filter = new TransactionFilter(
      [chainId],
      [address],
      [EVMTransactionHash(hash)],
      startTime,
      endTime,
    );
    td.when(
      mocks.dataWalletPersistence.getTransactions(td.matchers.anything()),
    ).thenReturn(
      okAsync([
        new EVMTransaction(
          ChainId(43114),
          EVMTransactionHash(""),
          UnixTimestamp(13001519),
          null,
          null,
          EVMAccountAddress("0x9366d30feba284e62900f6295bc28c9906f33172"),
          null,
          null,
          null,
          null,
          null,
          0,
        ),
      ]),
    );
    const result = await repo.eval(networkQuery);
    // console.log("Age is: ", result["value"]);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(true);
  });

  test("Network Query: Return False", async () => {
    const mocks = new NetworkQueryEvaluatorMocks();
    const repo = mocks.factory();
    const networkQuery = new AST_NetworkQuery(
      SDQL_Name("q1"),
      "boolean",
      EVMChainCode("AVAX"),
      new AST_Contract(
        ChainId(43114),
        EVMAccountAddress("0x9366d30feba284e62900f6295bc28c9906f33172"),
        EVMContractFunction("Transfer"),
        EVMContractDirection.From,
        EVMToken("ERC20"),
        new EVMTimestampRange(UnixTimestamp(13001519), UnixTimestamp(14910334)),
      ),
    );
    const chainId = networkQuery.contract.networkId;
    const address = networkQuery.contract.address as EVMAccountAddress;
    const hash = "";
    const startTime = networkQuery.contract.timestamp.start;
    const endTime = networkQuery.contract.timestamp.end;
    // console.log("Address: ", address)
    // console.log("Start Time: ", startTime)
    // console.log("End Time: ", endTime)
    const filter = new TransactionFilter(
      [chainId],
      [address],
      [EVMTransactionHash(hash)],
      startTime,
      endTime,
    );
    td.when(
      mocks.dataWalletPersistence.getTransactions(td.matchers.anything()),
    ).thenReturn(okAsync([]));
    const result = await repo.eval(networkQuery);
    // console.log("Age is: ", result["value"]);
    // console.log(result)
    expect(result).toBeDefined();
    expect(result["value"]).toBe(false);
  });
});

describe("Network Query Testing: ", () => {
  test("Network Query - Boolean", async () => {
    const mocks = new NetworkQueryEvaluatorMocks();
    const repo = mocks.factory();

    const networkQuery = new AST_NetworkQuery(
      SDQL_Name("q1"),
      "boolean",
      EVMChainCode("AVAX"),
      new AST_Contract(
        ChainId(43114),
        EVMAccountAddress("0x9366d30feba284e62900f6295bc28c9906f33172"),
        EVMContractFunction("Transfer"),
        EVMContractDirection.From,
        EVMToken("ERC20"),
        new EVMTimestampRange(UnixTimestamp(13001519), UnixTimestamp(14910334)),
      ),
    );
    const chainId = networkQuery.contract.networkId;
    const address = networkQuery.contract.address as EVMAccountAddress;
    const hash = "";
    const startTime = networkQuery.contract.timestamp.start;
    const endTime = networkQuery.contract.timestamp.end;

    const filter = new TransactionFilter(
      [chainId],
      [address],
      [EVMTransactionHash(hash)],
      startTime,
      endTime,
    );
    td.when(
      mocks.dataWalletPersistence.getTransactions(td.matchers.anything()),
    ).thenReturn(okAsync([]));
    const result = await repo.eval(networkQuery);
    // console.log("Age is: ", result["value"]);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(false);
  });

  test("Network Query - Object", async () => {
    const mocks = new NetworkQueryEvaluatorMocks();
    const repo = mocks.factory();

    const networkQuery = new AST_NetworkQuery(
      SDQL_Name("q1"),
      "object",
      EVMChainCode("AVAX"),
      new AST_Contract(
        ChainId(43114),
        EVMAccountAddress("0x9366d30feba284e62900f6295bc28c9906f33172"),
        EVMContractFunction("Transfer"),
        EVMContractDirection.From,
        EVMToken("ERC20"),
        new EVMTimestampRange(UnixTimestamp(13001519), UnixTimestamp(14910334)),
      ),
    );
    const chainId = networkQuery.contract.networkId;
    const address = networkQuery.contract.address as EVMAccountAddress;
    const hash = "";
    const startTime = networkQuery.contract.timestamp.start;
    const endTime = networkQuery.contract.timestamp.end;

    const filter = new TransactionFilter(
      [chainId],
      [address],
      [EVMTransactionHash(hash)],
      startTime,
      endTime,
    );
    td.when(
      mocks.dataWalletPersistence.getTransactions(td.matchers.anything()),
    ).thenReturn(okAsync([]));
    const result = await repo.eval(networkQuery);
    // console.log("Age is: ", result["value"]);
    expect(result).toBeDefined();
    //expect(result["value"]).toBe(false);

    expect(result["value"]["networkId"]).toBe(43114);
    expect(result["value"]["address"]).toBe(
      "0x9366d30feba284e62900f6295bc28c9906f33172",
    );
    expect(result["value"]["return"]).toBe(false);
  });
});
