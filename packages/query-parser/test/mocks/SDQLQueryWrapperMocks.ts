import { ITimeUtils, TimeUtils } from "@snickerdoodlelabs/common-utils";
import { SDQLQueryWrapper } from "@query-parser/interfaces/objects/SDQLQueryWrapper";
import { SDQLString } from "@snickerdoodlelabs/objects";

export class SDQLQueryWrapperMocks {
  public timeUtils: ITimeUtils = new TimeUtils();
  public makeQueryWrapper(schemaString: string): SDQLQueryWrapper {
    return SDQLQueryWrapper.fromString(SDQLString(schemaString), this.timeUtils);
  }
}