import { ITimeUtils } from "@snickerdoodlelabs/common-utils";
import { SDQLString } from "@snickerdoodlelabs/objects";

import { SDQLQueryWrapper } from "@query-parser/interfaces/objects/SDQLQueryWrapper.js";

export interface ISDQLQueryWrapperFactory {
  makeWrapper(schemaStr: SDQLString): SDQLQueryWrapper;
}
export const ISDQLQueryWrapperFactoryType = Symbol.for(
  "ISDQLQueryWrapperFactory",
);
