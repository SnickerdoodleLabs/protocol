import "reflect-metadata";

import { ITimeUtils, TimeUtils } from "@snickerdoodlelabs/common-utils";
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
  ISO8601DateString,
  PublicEvents,
  IpfsCID,
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
import { ContextProviderMock } from "@core-tests/mock/utilities/ContextProviderMock";

const queryCID = IpfsCID("mockCID");
const iso = UnixTimestamp(11);
const now = UnixTimestamp(2);
class blockchainTransactionQueryEvaluatorMocks {
  public transactionRepo = td.object<ITransactionHistoryRepository>();
  public balanceQueryEvaluator = td.object<IBalanceQueryEvaluator>();
  public contextProvider: ContextProviderMock;
  public timeUtils: ITimeUtils;
  public URLmap = new Map<URLString, number>([
    [URLString("www.snickerdoodlelabs.io"), 10],
  ]);

  public transactionsArray = new Array<ChainTransaction>();

  public constructor() {
    this.timeUtils = td.object<ITimeUtils>();
    td.when(this.timeUtils.getUnixNow()).thenReturn(now as never);
    this.contextProvider = new ContextProviderMock();
  }

  public factory() {
    return new BlockchainTransactionQueryEvaluator(
      this.transactionRepo,
      this.contextProvider,
    );
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

    const chainId = blockchainTransactionQuery.contract!.networkId;
    const address = blockchainTransactionQuery.contract!.address;
    const hash = "";
    const startTime = blockchainTransactionQuery.contract!.timestampRange.start;
    const endTime = blockchainTransactionQuery.contract!.timestampRange.end;

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
          iso,
        ),
      ]),
    );
    const result = await repo.eval(blockchainTransactionQuery, queryCID, now);
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
    const chainId = blockchainTransactionQuery.contract!.networkId;
    const address = blockchainTransactionQuery.contract!
      .address as EVMAccountAddress;
    const hash = "";
    const startTime = blockchainTransactionQuery.contract!.timestampRange.start;
    const endTime = blockchainTransactionQuery.contract!.timestampRange.end;

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
          iso,
        ),
      ]),
    );
    const result = await repo.eval(blockchainTransactionQuery, queryCID, now);
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
    const chainId = blockchainTransactionQuery.contract!.networkId;
    const address = blockchainTransactionQuery.contract!
      .address as EVMAccountAddress;
    const hash = "";
    const startTime = blockchainTransactionQuery.contract!.timestampRange.start;
    const endTime = blockchainTransactionQuery.contract!.timestampRange.end;

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
    const result = await repo.eval(blockchainTransactionQuery, queryCID, now);
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
    const chainId = blockchainTransactionQuery.contract!.networkId;
    const address = blockchainTransactionQuery.contract!
      .address as EVMAccountAddress;
    const hash = "";
    const startTime = blockchainTransactionQuery.contract!.timestampRange.start;
    const endTime = blockchainTransactionQuery.contract!.timestampRange.end;

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
    const result = await repo.eval(blockchainTransactionQuery, queryCID, now);
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
    const chainId = blockchainTransactionQuery.contract!.networkId;
    const address = blockchainTransactionQuery.contract!
      .address as EVMAccountAddress;
    const hash = "";
    const startTime = blockchainTransactionQuery.contract!.timestampRange.start;
    const endTime = blockchainTransactionQuery.contract!.timestampRange.end;

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
    const result = await repo.eval(blockchainTransactionQuery, queryCID, now);
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
