import "reflect-metadata";

import { TimeUtils } from "@snickerdoodlelabs/common-utils";
import { Age, CountryCode, IpfsCID } from "@snickerdoodlelabs/objects";
import {
  IQueryObjectFactory,
  ISDQLQueryWrapperFactory,
  SDQLQueryWrapperFactory,
} from "@snickerdoodlelabs/query-parser";
import { okAsync } from "neverthrow";
import * as td from "testdouble";

import {
  BlockchainTransactionQueryEvaluator,
  NftQueryEvaluator,
  QueryEvaluator,
  QueryRepository,
  BalanceQueryEvaluator,
  QueryFactories,
} from "@core/implementations/business/utilities/query/index.js";
import { IBlockchainTransactionQueryEvaluator } from "@core/interfaces/business/utilities/index.js";
import {
  IBalanceQueryEvaluator,
  IQueryFactories,
} from "@core/interfaces/business/utilities/query/index.js";
import {
  IBrowsingDataRepository,
  IPortfolioBalanceRepository,
  ITransactionHistoryRepository,
  IDemographicDataRepository,
  ISocialRepository,
} from "@core/interfaces/data/index.js";

// const ast = new AST(
//     Version("0.1"),
//     "Interactions with the Avalanche blockchain for 15-year and older individuals",
//     "Shrapnel"
//     );

export class ASTMocks {
  public demoRepo = td.object<IDemographicDataRepository>();
  public browsingRepo = td.object<IBrowsingDataRepository>();
  public txRepo = td.object<ITransactionHistoryRepository>();
  public queryObjectFactory = td.object<IQueryObjectFactory>();
  public balanceRepo = td.object<IPortfolioBalanceRepository>();
  public socialRepo = td.object<ISocialRepository>();

  public queryFactories: IQueryFactories;
  protected queryWrapperFactory: ISDQLQueryWrapperFactory;
  public queryRepository: QueryRepository;
  public queryEvaluator: QueryEvaluator;
  public balanceQueryEvaluator: IBalanceQueryEvaluator;
  public blockchainTransactionEvaluator: IBlockchainTransactionQueryEvaluator;
  public nftQueryEvaluator: NftQueryEvaluator;

  public constructor() {
    this.queryWrapperFactory = new SDQLQueryWrapperFactory(new TimeUtils());
    this.queryFactories = new QueryFactories(
      this.queryObjectFactory,
      this.queryWrapperFactory,
    );
    this.balanceQueryEvaluator = new BalanceQueryEvaluator(this.balanceRepo);
    this.blockchainTransactionEvaluator =
      new BlockchainTransactionQueryEvaluator(this.txRepo);
    this.nftQueryEvaluator = new NftQueryEvaluator(this.balanceRepo);
    this.balanceQueryEvaluator = new BalanceQueryEvaluator(this.balanceRepo);

    td.when(this.demoRepo.getAge()).thenReturn(okAsync(Age(25)));
    td.when(this.demoRepo.getLocation()).thenReturn(okAsync(CountryCode("1")));

    this.queryEvaluator = new QueryEvaluator(
      this.balanceQueryEvaluator,
      this.blockchainTransactionEvaluator,
      this.nftQueryEvaluator,
      this.demoRepo,
      this.browsingRepo,
      this.txRepo,
      this.socialRepo,
    );
    this.queryRepository = new QueryRepository(this.queryEvaluator);
  }

  public factory() {
    return this.queryFactories.makeAstEvaluator(
      IpfsCID("000"),
      null,
      this.queryRepository,
    );
  }
}
