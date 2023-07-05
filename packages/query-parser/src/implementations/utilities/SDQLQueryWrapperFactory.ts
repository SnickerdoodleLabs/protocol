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
    return new SDQLQueryWrapper(
      sdqlQuery,
      JSON.parse(sdqlQuery.query) as ISDQLQueryObject,
      this.timeUtils,
    );
  }
}
