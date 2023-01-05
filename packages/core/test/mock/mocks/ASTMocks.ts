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
  NetworkQueryEvaluator,
  QueryEvaluator,
  QueryRepository,
} from "@core/implementations/business/utilities/index.js";
import { BalanceQueryEvaluator } from "@core/implementations/business/utilities/query/index.js";
import { QueryFactories } from "@core/implementations/utilities/factory/index.js";
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

    td.when(this.persistenceRepo.getAge()).thenReturn(okAsync(Age(25)));
    td.when(this.persistenceRepo.getLocation()).thenReturn(
      okAsync(CountryCode("1")),
    );

    this.queryEvaluator = new QueryEvaluator(
      this.persistenceRepo,
      this.balanceQueryEvaluator,
      this.networkQueryEvaluator,
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
