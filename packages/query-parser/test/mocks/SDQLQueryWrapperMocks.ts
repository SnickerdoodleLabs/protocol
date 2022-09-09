import { ITimeUtils, TimeUtils } from "@snickerdoodlelabs/common-utils";
import { SDQLQueryWrapper } from "@query-parser/interfaces/objects/SDQLQueryWrapper";
import { SDQLString } from "@snickerdoodlelabs/objects";
import { SDQLQueryWrapperFactory } from "@query-parser/implementations/utilities/SDQLQueryWrapperFactory"

export class SDQLQueryWrapperMocks {
  public timeUtils: ITimeUtils = new TimeUtils();
  public makeQueryWrapper(schemaString: string): SDQLQueryWrapper {
    const factory = new SDQLQueryWrapperFactory(this.timeUtils)
    return factory.makeWrapper(SDQLString(schemaString));
  }
}