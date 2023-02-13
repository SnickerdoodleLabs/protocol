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
  ChainTransaction,
  EChainTechnology,
  EVMTransactionHash,
  ISDQLQueryReturnEnum,
} from "@snickerdoodlelabs/objects";
import {
  AST_BlockchainTransactionQuery,
  AST_Contract,
} from "@snickerdoodlelabs/query-parser";
import { okAsync } from "neverthrow";
import * as td from "testdouble";

import { BlockchainTransactionQueryEvaluator } from "@core/implementations/business/utilities/query/index.js";
import { IBalanceQueryEvaluator } from "@core/interfaces/business/utilities/query/index.js";

class blockchainTransactionQueryEvaluatorMocks {
  public dataWalletPersistence = td.object<IDataWalletPersistence>();
  public balanceQueryEvaluator = td.object<IBalanceQueryEvaluator>();

  public URLmap = new Map<URLString, number>([
    [URLString("www.snickerdoodlelabs.io"), 10],
  ]);

  public transactionsArray = new Array<ChainTransaction>();

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
    return new BlockchainTransactionQueryEvaluator(this.dataWalletPersistence);
  }
}

describe("QueryEvaluator: ", () => {
  test("Blockchain Transaction Query: Return True", async () => {
    const mocks = new blockchainTransactionQueryEvaluatorMocks();
    const repo = mocks.factory();

    const blockchainTransactionQuery = new AST_BlockchainTransactionQuery(
      SDQL_Name("q1"),
      ISDQLQueryReturnEnum.BOOLEAN,
      "blockchain_transactions",
      { name: "q1", return: ISDQLQueryReturnEnum.BOOLEAN },
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
    const chainId = blockchainTransactionQuery.contract.networkId;
    const address = blockchainTransactionQuery.contract
      .address as EVMAccountAddress;
    const hash = "";
    const startTime = blockchainTransactionQuery.contract.timestampRange.start;
    const endTime = blockchainTransactionQuery.contract.timestampRange.end;
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
          null,
          null,
        ),
      ]),
    );
    const result = await repo.eval(blockchainTransactionQuery);
    // console.log("Age is: ", result["value"]);
    // console.log(result)
    expect(result).toBeDefined();
    expect(result["value"]).toBe(true);
  });

  test("Blockchain Transaction Query: Return True", async () => {
    const mocks = new blockchainTransactionQueryEvaluatorMocks();
    const repo = mocks.factory();

    const blockchainTransactionQuery = new AST_BlockchainTransactionQuery(
      SDQL_Name("q1"),
      ISDQLQueryReturnEnum.BOOLEAN,
      "blockchain_transactions",
      { name: "q1", return: ISDQLQueryReturnEnum.BOOLEAN },
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
    const chainId = blockchainTransactionQuery.contract.networkId;
    const address = blockchainTransactionQuery.contract
      .address as EVMAccountAddress;
    const hash = "";
    const startTime = blockchainTransactionQuery.contract.timestampRange.start;
    const endTime = blockchainTransactionQuery.contract.timestampRange.end;

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
          null,
          null,
        ),
      ]),
    );
    const result = await repo.eval(blockchainTransactionQuery);
    // console.log("Age is: ", result["value"]);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(true);
  });

  test("Blockchain Transaction Query: Return False", async () => {
    const mocks = new blockchainTransactionQueryEvaluatorMocks();
    const repo = mocks.factory();
    const blockchainTransactionQuery = new AST_BlockchainTransactionQuery(
      SDQL_Name("q1"),
      ISDQLQueryReturnEnum.BOOLEAN,
      "blockchain_transactions",
      { name: "q1", return: ISDQLQueryReturnEnum.BOOLEAN },
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
    const chainId = blockchainTransactionQuery.contract.networkId;
    const address = blockchainTransactionQuery.contract
      .address as EVMAccountAddress;
    const hash = "";
    const startTime = blockchainTransactionQuery.contract.timestampRange.start;
    const endTime = blockchainTransactionQuery.contract.timestampRange.end;
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
    const result = await repo.eval(blockchainTransactionQuery);
    // console.log("Age is: ", result["value"]);
    // console.log(result)
    expect(result).toBeDefined();
    expect(result["value"]).toBe(false);
  });
});

describe("Blockchain Transaction Query Testing: ", () => {
  test("Blockchain Transaction Query - Boolean", async () => {
    const mocks = new blockchainTransactionQueryEvaluatorMocks();
    const repo = mocks.factory();

    const blockchainTransactionQuery = new AST_BlockchainTransactionQuery(
      SDQL_Name("q1"),
      ISDQLQueryReturnEnum.BOOLEAN,
      "blockchain_transactions",
      { name: "q1", return: ISDQLQueryReturnEnum.BOOLEAN },
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
    const chainId = blockchainTransactionQuery.contract.networkId;
    const address = blockchainTransactionQuery.contract
      .address as EVMAccountAddress;
    const hash = "";
    const startTime = blockchainTransactionQuery.contract.timestampRange.start;
    const endTime = blockchainTransactionQuery.contract.timestampRange.end;

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
    const result = await repo.eval(blockchainTransactionQuery);
    // console.log("Age is: ", result["value"]);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(false);
  });

  test("Blockchain Transaction Query - Object", async () => {
    const mocks = new blockchainTransactionQueryEvaluatorMocks();
    const repo = mocks.factory();

    const blockchainTransactionQuery = new AST_BlockchainTransactionQuery(
      SDQL_Name("q1"),
      ISDQLQueryReturnEnum.ARRAY,
      "blockchain_transactions",
      { name: "q1", return: ISDQLQueryReturnEnum.BOOLEAN },
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
    const chainId = blockchainTransactionQuery.contract.networkId;
    const address = blockchainTransactionQuery.contract
      .address as EVMAccountAddress;
    const hash = "";
    const startTime = blockchainTransactionQuery.contract.timestampRange.start;
    const endTime = blockchainTransactionQuery.contract.timestampRange.end;

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
    const result = await repo.eval(blockchainTransactionQuery);
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
