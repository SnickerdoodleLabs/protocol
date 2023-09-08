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
  TokenBalance,
  SDQL_Name,
  TickerSymbol,
  UnixTimestamp,
  URLString,
  ChainTransaction,
  EChainTechnology,
  EVMTransactionHash,
  ESDQLQueryReturn,
  PublicEvents,
} from "@snickerdoodlelabs/objects";
import {
  AST_BlockchainTransactionQuery,
  AST_Contract,
} from "@snickerdoodlelabs/query-parser";
import { okAsync } from "neverthrow";
import * as td from "testdouble";

import { BlockchainTransactionQueryEvaluator } from "@core/implementations/business/utilities/query/index.js";
import { IBalanceQueryEvaluator } from "@core/interfaces/business/utilities/query/index.js";
import { ITransactionHistoryRepository } from "@core/interfaces/data/index.js";

class blockchainTransactionQueryEvaluatorMocks {
  public transactionRepo = td.object<ITransactionHistoryRepository>();
  public balanceQueryEvaluator = td.object<IBalanceQueryEvaluator>();

  public URLmap = new Map<URLString, number>([
    [URLString("www.snickerdoodlelabs.io"), 10],
  ]);

  public transactionsArray = new Array<ChainTransaction>();

  public constructor() {
    //this.dataWalletPersistence.setLocation(CountryCode("US"));
    // td.when(this.dataWalletPersistence.getAge()).thenReturn(okAsync(Age(25)));
    // td.when(this.dataWalletPersistence.getGender()).thenReturn(
    //   okAsync(Gender("male")),
    // );
    // td.when(this.dataWalletPersistence.getSiteVisitsMap()).thenReturn(
    //   okAsync(this.URLmap),
    // );
    // td.when(this.dataWalletPersistence.getAccountBalances()).thenReturn(
    //   okAsync(this.accountBalances),
    // );
  }

  public factory() {
    return new BlockchainTransactionQueryEvaluator(this.transactionRepo);
  }
}

describe("QueryEvaluator: ", () => {
  test("Blockchain Transaction Query: Return True", async () => {
    const mocks = new blockchainTransactionQueryEvaluatorMocks();
    const repo = mocks.factory();

    const blockchainTransactionQuery = new AST_BlockchainTransactionQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "network",
      { name: "q1", return: ESDQLQueryReturn.Boolean },
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
    const address = blockchainTransactionQuery.contract.address;
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
      mocks.transactionRepo.getTransactions(td.matchers.anything()),
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
    const result = await repo.eval(blockchainTransactionQuery, new PublicEvents());
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
      ESDQLQueryReturn.Boolean,
      "network",
      { name: "q1", return: ESDQLQueryReturn.Boolean },
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
      mocks.transactionRepo.getTransactions(td.matchers.anything()),
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
    const result = await repo.eval(blockchainTransactionQuery, new PublicEvents());
    // console.log("Age is: ", result["value"]);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(true);
  });

  test("Blockchain Transaction Query: Return False", async () => {
    const mocks = new blockchainTransactionQueryEvaluatorMocks();
    const repo = mocks.factory();
    const blockchainTransactionQuery = new AST_BlockchainTransactionQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Boolean,
      "network",
      { name: "q1", return: ESDQLQueryReturn.Boolean },
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
      mocks.transactionRepo.getTransactions(td.matchers.anything()),
    ).thenReturn(okAsync([]));
    const result = await repo.eval(blockchainTransactionQuery, new PublicEvents());
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
      ESDQLQueryReturn.Boolean,
      "network",
      { name: "q1", return: ESDQLQueryReturn.Boolean },
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
      mocks.transactionRepo.getTransactions(td.matchers.anything()),
    ).thenReturn(okAsync([]));
    const result = await repo.eval(blockchainTransactionQuery, new PublicEvents());
    // console.log("Age is: ", result["value"]);
    expect(result).toBeDefined();
    expect(result["value"]).toBe(false);
  });

  test("Blockchain Transaction Query - Object", async () => {
    const mocks = new blockchainTransactionQueryEvaluatorMocks();
    const repo = mocks.factory();

    const blockchainTransactionQuery = new AST_BlockchainTransactionQuery(
      SDQL_Name("q1"),
      ESDQLQueryReturn.Array,
      "network",
      { name: "q1", return: ESDQLQueryReturn.Boolean },
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
      mocks.transactionRepo.getTransactions(td.matchers.anything()),
    ).thenReturn(okAsync([]));
    const result = await repo.eval(blockchainTransactionQuery, new PublicEvents());
    // console.log("Age is: ", result["value"]);
    expect(result).toBeDefined();
    //expect(result["value"]).toBe(false);

    // TODO: fix this
    //expect(result["value"]["networkId"]).toBe(43114);
    // expect(result["value"]["address"]).toBe(
    //   "0x9366d30feba284e62900f6295bc28c9906f33172",
    // );
    // expect(result["value"]["return"]).toBe(false);
  });
});
