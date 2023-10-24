import "reflect-metadata";

import { TimeUtils } from "@snickerdoodlelabs/common-utils";
import { DataPermissions, IpfsCID } from "@snickerdoodlelabs/objects";
import * as td from "testdouble";

import {
  QueryFactories,
  SDQLQueryWrapperFactory,
} from "@query-parser/implementations/index.js";
import {
  IQueryFactories,
  IQueryObjectFactory,
  IQueryRepository,
  ISDQLQueryWrapperFactory,
} from "@query-parser/interfaces/index.js";

export class ASTMocks {
  public queryObjectFactory = td.object<IQueryObjectFactory>();

  public queryFactories: IQueryFactories;
  protected queryWrapperFactory: ISDQLQueryWrapperFactory;
  public queryRepository = td.object<IQueryRepository>();

  // TODO: add whens for query repository

  public constructor() {
    this.queryWrapperFactory = new SDQLQueryWrapperFactory(new TimeUtils());

    this.queryFactories = new QueryFactories(
      this.queryObjectFactory,
      this.queryWrapperFactory,
      this.queryRepository,
    );
  }

  public factory() {
    return this.queryFactories.makeAstEvaluator(
      IpfsCID(""),
      DataPermissions.createWithAllPermissions(),
    );
  }
}
