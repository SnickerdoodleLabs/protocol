import { ISDQLQueryWrapperFactory } from "@query-parser/interfaces/utilities/ISDQLQueryWrapperFactory";
import { ISDQLQueryObject, SDQLString } from "@snickerdoodlelabs/objects";
import { SDQLQueryWrapper } from "@query-parser/interfaces/objects/SDQLQueryWrapper";
import { ITimeUtils, ITimeUtilsType } from "@snickerdoodlelabs/common-utils";
import { inject } from "inversify";

export class SDQLQueryWrapperFactory implements ISDQLQueryWrapperFactory {

  constructor(
    @inject(ITimeUtilsType)
    readonly timeUtils: ITimeUtils
  ) {}
  
  public makeWrapper(
    schemaStr: SDQLString
    ): SDQLQueryWrapper {
      return new SDQLQueryWrapper(JSON.parse(schemaStr)  as ISDQLQueryObject, this.timeUtils);
  }

}