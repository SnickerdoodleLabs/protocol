import {
  ISO8601DateString,
  MillisecondTimestamp,
  Month,
  UnixTimestamp,
  Year,
} from "@snickerdoodlelabs/objects";

export interface ITimeUtils {
  getUnixNow(): UnixTimestamp;
  getMillisecondNow(): MillisecondTimestamp;
  getISO8601TimeString(time: MillisecondTimestamp): string;
  convertTimestampToISOString(unixTimestamp: UnixTimestamp): ISO8601DateString;
}

export const ITimeUtilsType = Symbol.for("ITimeUtils");
