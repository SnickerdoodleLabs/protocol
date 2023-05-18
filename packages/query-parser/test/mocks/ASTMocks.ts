import "reflect-metadata";

import { TimeUtils } from "@snickerdoodlelabs/common-utils";
import {
  Age,
  CountryCode,
  DataPermissions,
  IpfsCID,
} from "@snickerdoodlelabs/objects";
import {
  IQueryFactories,
  IQueryObjectFactory,
  IQueryRepository,
  ISDQLQueryWrapperFactory,
  QueryFactories,
  SDQLQueryWrapperFactory,
} from "@snickerdoodlelabs/query-parser";
import { okAsync } from "neverthrow";
import * as td from "testdouble";

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
