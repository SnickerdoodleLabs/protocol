import { ITimeUtils, ITimeUtilsType } from "@snickerdoodlelabs/common-utils";
import { ISDQLQueryObject, SDQLString } from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";

import { SDQLQueryWrapper } from "@query-parser/interfaces/objects/SDQLQueryWrapper.js";
import { ISDQLQueryWrapperFactory } from "@query-parser/interfaces/utilities/ISDQLQueryWrapperFactory.js";

@injectable()
export class SDQLQueryWrapperFactory implements ISDQLQueryWrapperFactory {
  constructor(
    @inject(ITimeUtilsType)
    readonly timeUtils: ITimeUtils,
  ) {}

  public makeWrapper(schemaStr: SDQLString): SDQLQueryWrapper {
    return new SDQLQueryWrapper(
      JSON.parse(schemaStr) as ISDQLQueryObject,
      this.timeUtils,
    );
  }
}
