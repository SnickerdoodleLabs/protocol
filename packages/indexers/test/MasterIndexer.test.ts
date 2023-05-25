import "reflect-metadata";
import {
  IAxiosAjaxUtils,
  ILogUtils,
  ObjectUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  UninitializedError,
  DataPermissions,
  IPFSError,
  SDQLQueryRequest,
  QueryStatus,
  EQueryProcessingStatus,
  BlockNumber,
  PersistenceError,
  IEVMIndexer,
  ITokenPriceRepository,
  ISolanaIndexer,
} from "@snickerdoodlelabs/objects";
import { errAsync, okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import * as td from "testdouble";

import { IIndexerConfigProvider } from "@indexers/interfaces";
import { MasterIndexer } from "@indexers/MasterIndexer";

class MasterIndexerMocks {
  public alchemy: IEVMIndexer;
  public ankr: IEVMIndexer;
  public covalent: IEVMIndexer;
  public etherscan: IEVMIndexer;
  public etherscanNative: IEVMIndexer;
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
    this.alchemy = td.object<IEVMIndexer>();
    this.ankr = td.object<IEVMIndexer>();
    this.covalent = td.object<IEVMIndexer>();
    this.etherscan = td.object<IEVMIndexer>();
    this.etherscanNative = td.object<IEVMIndexer>();
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
    // td.when(this.sdqlQueryRepo.getSDQLQueryByCID(queryCID1)).thenReturn(
    //   okAsync(sdqlQuery),
    // );
  }
  public factory(): MasterIndexer {
    return new MasterIndexer(
      this.alchemy,
      this.ankr,
      this.covalent,
      this.etherscan,
      this.etherscanNative,
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

    // // Act
    // const result = await queryService.getLatestBalances();

    // // Assert
    // expect(result).toBeDefined();
    // expect(result.isErr()).toBeFalsy();
    // mocks.contextProvider.assertEventCounts({});
  });
});
