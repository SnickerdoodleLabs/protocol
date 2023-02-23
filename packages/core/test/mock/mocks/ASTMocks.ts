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

import { ProfileService } from "@core/implementations/business";
import {
  BlockchainTransactionQueryEvaluator,
  NftQueryEvaluator,
  QueryEvaluator,
  QueryRepository,
} from "@core/implementations/business/utilities";
import { BalanceQueryEvaluator } from "@core/implementations/business/utilities/query/BalanceQueryEvaluator";
import { QueryFactories } from "@core/implementations/utilities/factory";
import { IBlockchainTransactionQueryEvaluator } from "@core/interfaces/business/utilities";
import { IProfileService } from "@core/interfaces/business";
import { IBalanceQueryEvaluator } from "@core/interfaces/business/utilities/query/IBalanceQueryEvaluator";
import {
  IBrowsingDataRepository,
  IPortfolioBalanceRepository,
  ITransactionHistoryRepository,
  IDemographicDataRepository,
} from "@core/interfaces/data";
import { IQueryFactories } from "@core/interfaces/utilities/factory";

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

  public queryFactories: IQueryFactories;
  protected queryWrapperFactory: ISDQLQueryWrapperFactory;
  public queryRepository: QueryRepository;
  public queryEvaluator: QueryEvaluator;
  public balanceQueryEvaluator: IBalanceQueryEvaluator;
  public blockchainTransactionEvaluator: IBlockchainTransactionQueryEvaluator;
  public nftQueryEvaluator: NftQueryEvaluator;
  public profileService: IProfileService;

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
    this.profileService = new ProfileService(this.demoRepo);

    td.when(this.demoRepo.getAge()).thenReturn(okAsync(Age(25)));
    td.when(this.demoRepo.getLocation()).thenReturn(okAsync(CountryCode("1")));

    this.queryEvaluator = new QueryEvaluator(
      this.balanceQueryEvaluator,
      this.blockchainTransactionEvaluator,
      this.nftQueryEvaluator,
      this.profileService,
      this.demoRepo,
      this.browsingRepo,
      this.txRepo,
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
