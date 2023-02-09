import "reflect-metadata";

import { TimeUtils } from "@snickerdoodlelabs/common-utils";
import {
    Age,
    CountryCode, IDataWalletPersistence, IpfsCID
} from "@snickerdoodlelabs/objects";
import {
    IQueryObjectFactory,
    ISDQLQueryWrapperFactory,
    SDQLQueryWrapperFactory
} from "@snickerdoodlelabs/query-parser";
import { okAsync } from "neverthrow";
import * as td from "testdouble";

import {
    BlockchainTransactionQueryEvaluator,
    QueryEvaluator,
    QueryRepository
} from "@core/implementations/business/utilities";
import { BalanceQueryEvaluator } from "@core/implementations/business/utilities/query/BalanceQueryEvaluator";
import { QueryFactories } from "@core/implementations/utilities/factory";
import { IBlockchainTransactionQueryEvaluator } from "@core/interfaces/business/utilities";
import { IBalanceQueryEvaluator } from "@core/interfaces/business/utilities/query/IBalanceQueryEvaluator";
import { IQueryFactories } from "@core/interfaces/utilities/factory";
import { IProfileService } from "@core/interfaces/business";
import { ProfileService } from "@core/implementations/business";

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
  public blockchainTransactionEvaluator: IBlockchainTransactionQueryEvaluator;
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
    this.blockchainTransactionEvaluator = new BlockchainTransactionQueryEvaluator(
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
      this.blockchainTransactionEvaluator,
      this.profileService
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


