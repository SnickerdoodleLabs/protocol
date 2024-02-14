import { ITimeUtils, ITimeUtilsType } from "@snickerdoodlelabs/common-utils";
import { ISDQLQueryObject, SDQLQuery } from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";

import { SDQLQueryWrapper } from "@query-parser/interfaces/objects/SDQLQueryWrapper.js";
import { ISDQLQueryWrapperFactory } from "@query-parser/interfaces/utilities/ISDQLQueryWrapperFactory.js";

@injectable()
export class SDQLQueryWrapperFactory implements ISDQLQueryWrapperFactory {
  constructor(
    @inject(ITimeUtilsType)
    readonly timeUtils: ITimeUtils,
  ) {}

  public makeWrapper(sdqlQuery: SDQLQuery): SDQLQueryWrapper {
    const queryObject = JSON.parse(sdqlQuery.query) as ISDQLQueryObject;
    return new SDQLQueryWrapper(sdqlQuery, queryObject, this.timeUtils);
  }
}
