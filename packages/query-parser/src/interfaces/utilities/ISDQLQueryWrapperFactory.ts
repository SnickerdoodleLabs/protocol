import { SDQLString } from "@snickerdoodlelabs/objects";
import { SDQLQueryWrapper } from "@query-parser/interfaces/objects/SDQLQueryWrapper";
import { ITimeUtils } from "@snickerdoodlelabs/common-utils";

export interface ISDQLQueryWrapperFactory {
  makeWrapper(
    schemaStr: SDQLString
    ): SDQLQueryWrapper;
}
export const ISDQLQueryWrapperFactoryType = Symbol.for("ISDQLQueryWrapperFactory");