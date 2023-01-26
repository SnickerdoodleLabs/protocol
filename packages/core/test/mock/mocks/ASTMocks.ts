import "reflect-metadata";

import { ProfileService } from "@core/implementations/business";

import { TimeUtils } from "@snickerdoodlelabs/common-utils";

import {
  NetworkQueryEvaluator,
  QueryEvaluator,
  QueryRepository,
} from "@core/implementations/business/utilities";

import { Age, CountryCode, IpfsCID } from "@snickerdoodlelabs/objects";

import { BalanceQueryEvaluator } from "@core/implementations/business/utilities/query/BalanceQueryEvaluator";

import {
  IQueryObjectFactory,
  ISDQLQueryWrapperFactory,
  SDQLQueryWrapperFactory,
} from "@snickerdoodlelabs/query-parser";

import { QueryFactories } from "@core/implementations/utilities/factory";

import { okAsync } from "neverthrow";

import { IProfileService } from "@core/interfaces/business";

import * as td from "testdouble";

import { INetworkQueryEvaluator } from "@core/interfaces/business/utilities";
import { IBalanceQueryEvaluator } from "@core/interfaces/business/utilities/query/IBalanceQueryEvaluator";
import {
  IBrowsingDataRepository,
  IPortfolioBalanceRepository,
  ITransactionHistoryRepository,
  IWeb2DataRepository,
} from "@core/interfaces/data";
import { IQueryFactories } from "@core/interfaces/utilities/factory";

// const ast = new AST(
//     Version("0.1"),
//     "Interactions with the Avalanche blockchain for 15-year and older individuals",
//     "Shrapnel"
//     );

export class ASTMocks {
  public web2Repo = td.object<IWeb2DataRepository>();
  public browsingRepo = td.object<IBrowsingDataRepository>();
  public txRepo = td.object<ITransactionHistoryRepository>();
  public queryObjectFactory = td.object<IQueryObjectFactory>();
  public balanceRepo = td.object<IPortfolioBalanceRepository>();

  public queryFactories: IQueryFactories;
  protected queryWrapperFactory: ISDQLQueryWrapperFactory;
  public queryRepository: QueryRepository;
  public queryEvaluator: QueryEvaluator;
  public balanceQueryEvaluator: IBalanceQueryEvaluator;
  public networkQueryEvaluator: INetworkQueryEvaluator;
  public profileService: IProfileService;

  public constructor() {
    this.queryWrapperFactory = new SDQLQueryWrapperFactory(new TimeUtils());
    this.queryFactories = new QueryFactories(
      this.queryObjectFactory,
      this.queryWrapperFactory,
    );
    this.balanceQueryEvaluator = new BalanceQueryEvaluator(this.balanceRepo);
    this.networkQueryEvaluator = new NetworkQueryEvaluator(this.txRepo);
    this.profileService = new ProfileService(this.web2Repo);

    td.when(this.web2Repo.getAge()).thenReturn(okAsync(Age(25)));
    td.when(this.web2Repo.getLocation()).thenReturn(okAsync(CountryCode("1")));

    this.queryEvaluator = new QueryEvaluator(
      this.balanceQueryEvaluator,
      this.networkQueryEvaluator,
      this.profileService,
      this.web2Repo,
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
