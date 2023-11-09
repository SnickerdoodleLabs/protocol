import "reflect-metadata";
import {
  IAxiosAjaxUtils,
  IBigNumberUtils,
  ILogUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  ITokenPriceRepository,
  EVMAccountAddress,
  EChain,
  EComponentStatus,
  IndexerSupportSummary,
  TokenBalance,
  AccountIndexingError,
  AjaxError,
  MethodSupportError,
  EVMNFT,
  EVMTransaction,
  EChainTechnology,
  EVMContractAddress,
  BigNumberString,
  TickerSymbol,
  UnixTimestamp,
  EVMTransactionHash,
  EIndexerMethod,
  ISO8601DateString,
} from "@snickerdoodlelabs/objects";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import * as td from "testdouble";

import {
  IEVMIndexer,
  IIndexerConfigProvider,
  IIndexerContextProvider,
  ISolanaIndexer,
  ISuiIndexer,
} from "@indexers/interfaces/index.js";
import { MasterIndexer } from "@indexers/MasterIndexer.js";
import { ContextProviderMock } from "@indexers-test/mock/ContextProviderMock";

const chain = EChain.Arbitrum;
const accountAddress = EVMAccountAddress("accountAddress1");
const tokenAddress = EVMContractAddress("tokenAddress1");
const validBalance = BigNumberString("100");
const invalidBalance = BigNumberString("invalid");
const tokenDecimals = 18;
const tokenId = BigNumberString("1");
const timestamp = UnixTimestamp(12345);
const evmTransactionHash1 = EVMTransactionHash("hash1");
const iso = UnixTimestamp(11);
class EVMIndexerMock implements IEVMIndexer {
  public constructor(
    public _name: string,
    public _indexerSupport: Map<EChain, IndexerSupportSummary>,
    public _getBalancesForAccountResult: ResultAsync<
      TokenBalance[],
      AccountIndexingError | AjaxError | MethodSupportError
    > = okAsync([]),
    public _getTokensForAccountResult: ResultAsync<
      EVMNFT[],
      AccountIndexingError | AjaxError | MethodSupportError
    > = okAsync([]),
    public _getEVMTransactionsResult: ResultAsync<
      EVMTransaction[],
      AccountIndexingError | AjaxError | MethodSupportError
    > = okAsync([]),
  ) {}

  public initialize(): ResultAsync<void, never> {
    return okAsync(undefined);
  }

  public name(): string {
    return this._name;
  }

  public healthStatus(): Map<EChain, EComponentStatus> {
    const health = new Map<EChain, EComponentStatus>();
    this._indexerSupport.forEach(
      (support: IndexerSupportSummary, chain: EChain) => {
        if (support.balances || support.transactions || support.nfts) {
          health.set(chain, EComponentStatus.Available);
        } else {
          health.set(chain, EComponentStatus.NoKeyProvided);
        }
      },
    );
    return health;
  }

  public getSupportedChains(): Map<EChain, IndexerSupportSummary> {
    return this._indexerSupport;
  }

  public getBalancesForAccount(
    chain: EChain,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<
    TokenBalance[],
    AccountIndexingError | AjaxError | MethodSupportError
  > {
    return this._getBalancesForAccountResult;
  }

  public getTokensForAccount(
    chain: EChain,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<
    EVMNFT[],
    AccountIndexingError | AjaxError | MethodSupportError
  > {
    return this._getTokensForAccountResult;
  }

  public getEVMTransactions(
    chain: EChain,
    accountAddress: EVMAccountAddress,
    startTime: Date,
    endTime?: Date,
  ): ResultAsync<
    EVMTransaction[],
    AccountIndexingError | AjaxError | MethodSupportError
  > {
    return this._getEVMTransactionsResult;
  }
}

// @mock
class MasterIndexerMocks {
  public context: IIndexerContextProvider;
  public alchemy: EVMIndexerMock;
  public ankr: EVMIndexerMock;
  public bluez: EVMIndexerMock;
  public blockvision: ISuiIndexer;
  public covalent: EVMIndexerMock;
  public etherscan: EVMIndexerMock;
  public moralis: EVMIndexerMock;
  public nftscan: EVMIndexerMock;
  public oklink: EVMIndexerMock;
  public poapRepo: EVMIndexerMock;
  public matic: EVMIndexerMock;
  public sim: EVMIndexerMock;
  public sol: ISolanaIndexer;
  public sxt: EVMIndexerMock;
  public configProvider: IIndexerConfigProvider;
  public ajaxUtils: IAxiosAjaxUtils;
  public tokenPriceRepo: ITokenPriceRepository;
  public logUtils: ILogUtils;
  public bigNumberUtils: IBigNumberUtils;

  public constructor() {
    this.context = new ContextProviderMock();
    this.alchemy = new EVMIndexerMock(
      "Alchemy",
      new Map<EChain, IndexerSupportSummary>([
        [chain, new IndexerSupportSummary(chain, true, true, true)],
      ]),
    );
    this.ankr = new EVMIndexerMock(
      "Ankr",
      new Map<EChain, IndexerSupportSummary>([
        [chain, new IndexerSupportSummary(chain, true, true, true)],
      ]),
    );
    this.bluez = new EVMIndexerMock(
      "Bluez",
      new Map<EChain, IndexerSupportSummary>([
        [chain, new IndexerSupportSummary(chain, false, false, true)],
      ]),
    );
    this.covalent = new EVMIndexerMock(
      "Covalent",
      new Map<EChain, IndexerSupportSummary>(),
    );
    this.etherscan = new EVMIndexerMock(
      "Etherscan",
      new Map<EChain, IndexerSupportSummary>(),
    );
    this.moralis = new EVMIndexerMock(
      "Moralis",
      new Map<EChain, IndexerSupportSummary>(),
    );
    this.nftscan = new EVMIndexerMock(
      "NFTScan",
      new Map<EChain, IndexerSupportSummary>(),
    );
    this.oklink = new EVMIndexerMock(
      "OKLink",
      new Map<EChain, IndexerSupportSummary>(),
    );
    this.poapRepo = new EVMIndexerMock(
      "POAP",
      new Map<EChain, IndexerSupportSummary>(),
    );
    this.matic = new EVMIndexerMock(
      "Matic",
      new Map<EChain, IndexerSupportSummary>(),
    );
    this.sim = new EVMIndexerMock(
      "Sim",
      new Map<EChain, IndexerSupportSummary>(),
    );
    this.sxt = new EVMIndexerMock(
      "SxT",
      new Map<EChain, IndexerSupportSummary>(),
    );
    this.sol = td.object<ISolanaIndexer>();
    this.blockvision = td.object<ISuiIndexer>();
    this.bigNumberUtils = td.object<IBigNumberUtils>();

    this.configProvider = td.object<IIndexerConfigProvider>();
    this.ajaxUtils = td.object<IAxiosAjaxUtils>();
    this.tokenPriceRepo = td.object<ITokenPriceRepository>();
    this.logUtils = td.object<ILogUtils>();

    // Solidity Repositories -----------------------------------------------------
    td.when(this.sol.initialize()).thenReturn(okAsync(undefined));
    td.when(this.sol.healthStatus()).thenReturn(
      new Map<EChain, EComponentStatus>(),
    );
    td.when(this.sol.getSupportedChains()).thenReturn(
      new Map<EChain, IndexerSupportSummary>(),
    );
  }

  public factory(): MasterIndexer {
    return new MasterIndexer(
      this.configProvider,
      this.context,
      this.alchemy,
      this.ankr,
      this.blockvision,
      this.bluez,
      this.covalent,
      this.etherscan,
      this.moralis,
      this.nftscan,
      this.oklink,
      this.poapRepo,
      this.matic,
      this.sim,
      this.sol,
      this.sxt,
      this.logUtils,
      this.bigNumberUtils,
    );
  }

  public getTokenBalance(balance: BigNumberString): TokenBalance {
    return new TokenBalance(
      EChainTechnology.EVM,
      TickerSymbol("token1"),
      chain,
      tokenAddress,
      accountAddress,
      balance,
      tokenDecimals,
    );
  }

  public getEVMNFT(balance: BigNumberString): EVMNFT {
    return new EVMNFT(
      tokenAddress,
      tokenId,
      "contractType",
      accountAddress,
      undefined,
      undefined,
      invalidBalance,
      "name",
      chain,
      undefined,
      undefined,
    );
  }

  public getEVMTransaction(value: BigNumberString): EVMTransaction {
    return new EVMTransaction(
      chain,
      evmTransactionHash1,
      timestamp,
      null,
      accountAddress,
      accountAddress,
      value,
      null,
      null,
      null,
      null,
      null,
      null,
      iso,
    );
  }
}

describe("MasterIndexer tests", () => {
  test("initialize() works", async () => {
    // Arrange
    const mocks = new MasterIndexerMocks();
    const indexer = mocks.factory();

    // Act
    const result = await indexer.initialize();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBeUndefined();
  });

  test("getSupportedChains() works", async () => {
    // Arrange
    const mocks = new MasterIndexerMocks();
    const indexer = mocks.factory();

    // Act
    const result = await indexer.getSupportedChains();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const supportedChains = result._unsafeUnwrap();
    expect(supportedChains.length).toBe(1);
    expect(supportedChains[0]).toBe(chain);
  });

  test("getSupportedChains() works with method specified", async () => {
    // Arrange
    const mocks = new MasterIndexerMocks();
    const indexer = mocks.factory();

    // Act
    const result = await indexer.getSupportedChains(EIndexerMethod.Balances);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const supportedChains = result._unsafeUnwrap();
    expect(supportedChains.length).toBe(1);
    expect(supportedChains[0]).toBe(chain);
  });

  test("getSupportedChains() works with method specified but no support for that method", async () => {
    // Arrange
    const mocks = new MasterIndexerMocks();

    mocks.alchemy = new EVMIndexerMock(
      "Alchemy",
      new Map<EChain, IndexerSupportSummary>([
        [chain, new IndexerSupportSummary(chain, false, true, true)],
      ]),
    );
    mocks.ankr = new EVMIndexerMock(
      "Ankr",
      new Map<EChain, IndexerSupportSummary>([
        [chain, new IndexerSupportSummary(chain, false, true, true)],
      ]),
    );
    const indexer = mocks.factory();

    // Act
    const result = await indexer.getSupportedChains(EIndexerMethod.Balances);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const supportedChains = result._unsafeUnwrap();
    expect(supportedChains.length).toBe(0);
  });

  test("getLatestBalances() works, returns from Ankr", async () => {
    // Arrange
    const mocks = new MasterIndexerMocks();
    const indexer = mocks.factory();

    // Act
    const result = await indexer.getLatestBalances(chain, accountAddress);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const latestBalances = result._unsafeUnwrap();
    expect(latestBalances.length).toBe(0);
  });

  test("getLatestBalances() works, Ankr returns invalid BNS and is corrected", async () => {
    // Arrange
    const mocks = new MasterIndexerMocks();

    const tokenBalanceInvalid = mocks.getTokenBalance(invalidBalance);

    mocks.ankr = new EVMIndexerMock(
      "Ankr",
      new Map<EChain, IndexerSupportSummary>([
        [chain, new IndexerSupportSummary(chain, true, true, true)],
      ]),
      okAsync([tokenBalanceInvalid]),
    );

    const indexer = mocks.factory();

    // Act
    const result = await indexer.getLatestBalances(chain, accountAddress);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const latestBalances = result._unsafeUnwrap();
    expect(latestBalances.length).toBe(1);
    expect(latestBalances[0]).toBe(tokenBalanceInvalid);
    expect(latestBalances[0].balance).toBe("0");
  });

  test("getLatestBalances() works, Ankr fails, returns from Alchemy", async () => {
    // Arrange
    const mocks = new MasterIndexerMocks();

    const tokenBalance = mocks.getTokenBalance(validBalance);

    mocks.ankr = new EVMIndexerMock(
      "Ankr",
      new Map<EChain, IndexerSupportSummary>([
        [chain, new IndexerSupportSummary(chain, true, true, true)],
      ]),
      errAsync(new AccountIndexingError("Ankr error")),
    );
    mocks.alchemy = new EVMIndexerMock(
      "Alchemy",
      new Map<EChain, IndexerSupportSummary>([
        [chain, new IndexerSupportSummary(chain, true, true, true)],
      ]),
      okAsync([tokenBalance]),
    );
    const indexer = mocks.factory();

    // Act
    const result = await indexer.getLatestBalances(chain, accountAddress);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const latestBalances = result._unsafeUnwrap();
    expect(latestBalances.length).toBe(1);
    expect(latestBalances[0]).toBe(tokenBalance);
  });

  test("getLatestNFTs() works, returns from Ankr", async () => {
    // Arrange
    const mocks = new MasterIndexerMocks();
    const indexer = mocks.factory();

    // Act
    const result = await indexer.getLatestNFTs(chain, accountAddress);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const latestBalances = result._unsafeUnwrap();
    expect(latestBalances.length).toBe(0);
  });

  test("getLatestNFTs() works, Ankr returns invalid BNS and is corrected", async () => {
    // Arrange
    const mocks = new MasterIndexerMocks();

    const evmNFTInvalid = mocks.getEVMNFT(invalidBalance);

    mocks.ankr = new EVMIndexerMock(
      "Ankr",
      new Map<EChain, IndexerSupportSummary>([
        [chain, new IndexerSupportSummary(chain, true, true, true)],
      ]),
      undefined,
      okAsync([evmNFTInvalid]),
    );

    const indexer = mocks.factory();

    // Act
    const result = await indexer.getLatestNFTs(chain, accountAddress);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const latestNFTs = result._unsafeUnwrap() as EVMNFT[];
    expect(latestNFTs.length).toBe(1);
    expect(latestNFTs[0]).toBe(evmNFTInvalid);
    expect(latestNFTs[0].amount).toBe("0");
  });

  test("getLatestNFTs() works, Ankr fails, returns from Alchemy", async () => {
    // Arrange
    const mocks = new MasterIndexerMocks();

    const evmNFT = mocks.getEVMNFT(validBalance);

    mocks.ankr = new EVMIndexerMock(
      "Ankr",
      new Map<EChain, IndexerSupportSummary>([
        [chain, new IndexerSupportSummary(chain, true, true, true)],
      ]),
      undefined,
      errAsync(new AccountIndexingError("Ankr error")),
    );
    mocks.alchemy = new EVMIndexerMock(
      "Alchemy",
      new Map<EChain, IndexerSupportSummary>([
        [chain, new IndexerSupportSummary(chain, true, true, true)],
      ]),
      undefined,
      okAsync([evmNFT]),
    );
    const indexer = mocks.factory();

    // Act
    const result = await indexer.getLatestNFTs(chain, accountAddress);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const latestNFTs = result._unsafeUnwrap() as EVMNFT[];
    expect(latestNFTs.length).toBe(1);
    expect(latestNFTs[0]).toBe(evmNFT);
  });

  test("getLatestTransactions() works, returns from Ankr", async () => {
    // Arrange
    const mocks = new MasterIndexerMocks();
    const indexer = mocks.factory();

    // Act
    const result = await indexer.getLatestTransactions(
      accountAddress,
      timestamp,
      chain,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const latestTransactions = result._unsafeUnwrap();
    expect(latestTransactions.length).toBe(0);
  });

  test("getLatestTransactions() works, Ankr fails, returns from Alchemy", async () => {
    // Arrange
    const mocks = new MasterIndexerMocks();

    const transaction = mocks.getEVMTransaction(validBalance);

    mocks.ankr = new EVMIndexerMock(
      "Ankr",
      new Map<EChain, IndexerSupportSummary>([
        [chain, new IndexerSupportSummary(chain, true, true, true)],
      ]),
      undefined,
      undefined,
      errAsync(new AccountIndexingError("Ankr error")),
    );
    mocks.alchemy = new EVMIndexerMock(
      "Alchemy",
      new Map<EChain, IndexerSupportSummary>([
        [chain, new IndexerSupportSummary(chain, true, true, true)],
      ]),
      undefined,
      undefined,
      okAsync([transaction]),
    );
    const indexer = mocks.factory();

    // Act
    const result = await indexer.getLatestTransactions(
      accountAddress,
      timestamp,
      chain,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const latestTransactions = result._unsafeUnwrap();
    expect(latestTransactions.length).toBe(1);
    expect(latestTransactions[0]).toBe(transaction);
  });
});
