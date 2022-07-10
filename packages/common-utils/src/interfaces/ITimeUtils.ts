import { UnixTimestamp } from "@snickerdoodlelabs/objects";

export interface ITimeUtils {
  getUnixNow(): UnixTimestamp;
}

export const ITimeUtilsType = Symbol.for("ITimeUtils");
