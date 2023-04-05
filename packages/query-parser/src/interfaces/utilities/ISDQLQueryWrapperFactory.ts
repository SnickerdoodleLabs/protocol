import { SDQLQuery } from "@snickerdoodlelabs/objects";

import { SDQLQueryWrapper } from "@query-parser/interfaces/objects/SDQLQueryWrapper.js";

export interface ISDQLQueryWrapperFactory {
  makeWrapper(sdqlQuery: SDQLQuery): SDQLQueryWrapper;
}
export const ISDQLQueryWrapperFactoryType = Symbol.for(
  "ISDQLQueryWrapperFactory",
);
