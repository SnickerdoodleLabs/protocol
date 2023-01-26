import "reflect-metadata";

import { ProfileService } from "@core/implementations/business/index.js";

import { TimeUtils } from "@snickerdoodlelabs/common-utils";

import {
  NetworkQueryEvaluator,
  QueryEvaluator,
  QueryRepository,
} from "@core/implementations/business/utilities/index.js";

import { Age, CountryCode, IpfsCID } from "@snickerdoodlelabs/objects";

import { BalanceQueryEvaluator } from "@core/implementations/business/utilities/query/index.js";

import {
  IQueryObjectFactory,
  ISDQLQueryWrapperFactory,
  SDQLQueryWrapperFactory,
} from "@snickerdoodlelabs/query-parser";

import { QueryFactories } from "@core/implementations/utilities/factory/index.js";

import { okAsync } from "neverthrow";

import { IProfileService } from "@core/interfaces/business/index.js";

import * as td from "testdouble";

import { INetworkQueryEvaluator } from "@core/interfaces/business/utilities/index.js";
import { IBalanceQueryEvaluator } from "@core/interfaces/business/utilities/query/index.js";
import { IDataWalletPersistence } from "@core/interfaces/data/index.js";
import { IQueryFactories } from "@core/interfaces/utilities/factory/index.js";

// const ast = new AST(
//     Version("0.1"),
//     "Interactions with the Avalanche blockchain for 15-year and older individuals",
//     "Shrapnel"
//     );

export class ASTMocks {
  public persistenceRepo = td.object<IDataWalletPersistence>();
  public queryObjectFactory = td.object<IQueryObjectFactory>();

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
    this.balanceQueryEvaluator = new BalanceQueryEvaluator(
      this.persistenceRepo,
    );
    this.networkQueryEvaluator = new NetworkQueryEvaluator(
      this.persistenceRepo,
    );
    this.profileService = new ProfileService(this.persistenceRepo);

    td.when(this.persistenceRepo.getAge()).thenReturn(okAsync(Age(25)));
    td.when(this.persistenceRepo.getLocation()).thenReturn(
      okAsync(CountryCode("1")),
    );

    this.queryEvaluator = new QueryEvaluator(
      this.persistenceRepo,
      this.balanceQueryEvaluator,
      this.networkQueryEvaluator,
      this.profileService,
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
