import {
  ISO8601DateString,
  MillisecondTimestamp,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";

export interface ITimeUtils {
  getUnixNow(): UnixTimestamp;
  getMillisecondNow(): MillisecondTimestamp;
  getISO8601TimeString(time: MillisecondTimestamp): ISO8601DateString;
}

export const ITimeUtilsType = Symbol.for("ITimeUtils");
