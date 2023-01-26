import {
  avalanche3SchemaStr,
  IQueryObjectFactory,
  QueryObjectFactory,
} from "@snickerdoodlelabs/query-parser";

import { SDQLQueryWrapperMocks } from "./SDQLQueryWrapperMocks";

export class QueryObjectFactoryMocks {
  public wrapperMocks = new SDQLQueryWrapperMocks();
  public schema = this.wrapperMocks.makeQueryWrapper(avalanche3SchemaStr);
  factory(): IQueryObjectFactory {
    return new QueryObjectFactory();
  }
}
