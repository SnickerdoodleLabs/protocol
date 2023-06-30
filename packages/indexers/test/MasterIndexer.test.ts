import "reflect-metadata";
import { IAxiosAjaxUtils, ILogUtils } from "@snickerdoodlelabs/common-utils";
import {
  IEVMIndexer,
  ITokenPriceRepository,
  ISolanaIndexer,
  ChainId,
  EVMAccountAddress,
} from "@snickerdoodlelabs/objects";
import { okAsync } from "neverthrow";
import { UnixTimestamp } from "packages/objects/src";
import * as td from "testdouble";

import {
  IIndexerConfigProvider,
  IIndexerContextProvider,
} from "@indexers/interfaces";
import { MasterIndexer } from "@indexers/MasterIndexer";

// @mock
class MasterIndexerMocks {
  public context: IIndexerContextProvider;
  public alchemy: IEVMIndexer;
  public ankr: IEVMIndexer;
  public covalent: IEVMIndexer;
  public etherscan: IEVMIndexer;
  public moralis: IEVMIndexer;
  public nftscan: IEVMIndexer;
  public oklink: IEVMIndexer;
  public poapRepo: IEVMIndexer;
  public matic: IEVMIndexer;
  public sim: IEVMIndexer;
  public sol: ISolanaIndexer;
  public configProvider: IIndexerConfigProvider;
  public ajaxUtils: IAxiosAjaxUtils;
  public tokenPriceRepo: ITokenPriceRepository;
  public logUtils: ILogUtils;

  public constructor() {
    this.context = td.object<IIndexerContextProvider>();
    this.alchemy = td.object<IEVMIndexer>();
    this.ankr = td.object<IEVMIndexer>();
    this.covalent = td.object<IEVMIndexer>();
    this.etherscan = td.object<IEVMIndexer>();
    this.moralis = td.object<IEVMIndexer>();
    this.nftscan = td.object<IEVMIndexer>();
    this.oklink = td.object<IEVMIndexer>();
    this.poapRepo = td.object<IEVMIndexer>();
    this.matic = td.object<IEVMIndexer>();
    this.sim = td.object<IEVMIndexer>();
    this.sol = td.object<ISolanaIndexer>();

    this.configProvider = td.object<IIndexerConfigProvider>();
    this.ajaxUtils = td.object<IAxiosAjaxUtils>();
    this.tokenPriceRepo = td.object<ITokenPriceRepository>();
    this.logUtils = td.object<ILogUtils>();

    // IEVM Repositories ---------------------------------------------------------
    // td.when(this.context.getContext()).thenReturn();
    // td.when(this.sdqlQueryRepo.getSDQLQueryByCID(queryCID1)).thenReturn(
    //   okAsync(sdqlQuery),
    // );
  }
  public factory(): MasterIndexer {
    return new MasterIndexer(
      this.context,
      this.alchemy,
      this.ankr,
      this.covalent,
      this.etherscan,
      this.moralis,
      this.nftscan,
      this.oklink,
      this.poapRepo,
      this.matic,
      this.sim,
      this.sol,
      this.logUtils,
    );
  }
}

describe("MasterIndexer.initialize() tests", () => {
  test("initialize() works", async () => {
    // Arrange
    const mocks = new MasterIndexerMocks();
    const queryService = mocks.factory();

    td.when(queryService.initialize()).thenReturn(okAsync(undefined));

    const result = await queryService.initialize();

    expect(result).toBeUndefined();
  });

  test("getLatestBalances() works", async () => {
    // Arrange
    const mocks = new MasterIndexerMocks();
    const queryService = mocks.factory();

    td.when(
      queryService.getLatestBalances(
        ChainId(1),
        EVMAccountAddress("AccountAddress"),
      ),
    ).thenReturn(okAsync([]));

    const result = await queryService.getLatestBalances(
      ChainId(1),
      EVMAccountAddress("AccountAddress"),
    );

    expect(result).toBe([]);
  });

  test("getLatestNfts() works", async () => {
    // Arrange
    const mocks = new MasterIndexerMocks();
    const queryService = mocks.factory();

    td.when(
      queryService.getLatestNFTs(
        ChainId(1),
        EVMAccountAddress("AccountAddress"),
      ),
    ).thenReturn(okAsync([]));

    const result = await queryService.getLatestNFTs(
      ChainId(1),
      EVMAccountAddress("AccountAddress"),
    );

    expect(result).toBe([]);
  });

  test("getLatestTransactions() works", async () => {
    // Arrange
    const mocks = new MasterIndexerMocks();
    const queryService = mocks.factory();

    td.when(
      queryService.getLatestTransactions(
        EVMAccountAddress("AccountAddress"),
        UnixTimestamp(0),
        ChainId(1),
      ),
    ).thenReturn(okAsync([]));

    const result = await queryService.getLatestTransactions(
      EVMAccountAddress("AccountAddress"),
      UnixTimestamp(0),
      ChainId(1),
    );

    expect(result).toBe([]);
  });
});
