import { ITimeUtils, TimeUtils } from "@snickerdoodlelabs/common-utils";
import { SDQLString } from "@snickerdoodlelabs/objects";
import {
  SDQLQueryWrapper,
  SDQLQueryWrapperFactory,
} from "@snickerdoodlelabs/query-parser";

export class SDQLQueryWrapperMocks {
  public timeUtils: ITimeUtils = new TimeUtils();
  public makeQueryWrapper(schemaString: string): SDQLQueryWrapper {
    const factory = new SDQLQueryWrapperFactory(this.timeUtils);
    return factory.makeWrapper(SDQLString(schemaString));
  }
}
