import { TimeUtils } from "@snickerdoodlelabs/common-utils";
import { IpfsCID, SDQLQuery } from "@snickerdoodlelabs/objects";
import {
  avalanche3SchemaStr,
  IQueryObjectFactory,
  QueryObjectFactory,
  SDQLQueryWrapperFactory,
} from "@snickerdoodlelabs/query-parser";

const queryCID = IpfsCID("0");
export class QueryObjectFactoryMocks {
  public timeUtils = new TimeUtils();
  public sdqlQueryWrapperFactory = new SDQLQueryWrapperFactory(this.timeUtils);

  public schema = this.sdqlQueryWrapperFactory.makeWrapper(
    new SDQLQuery(queryCID, avalanche3SchemaStr),
  );
  factory(): IQueryObjectFactory {
    return new QueryObjectFactory();
  }
}
