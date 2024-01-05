import {
  ISO8601DateString,
  MillisecondTimestamp,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";

export interface ITimeUtils {
  getUnixNow(): UnixTimestamp;
  getMillisecondNow(): MillisecondTimestamp;
  getISO8601TimeString(time: MillisecondTimestamp): string;
  convertTimestampToISOString(unixTimestamp: UnixTimestamp): ISO8601DateString;
  getUnixTodayStart(): UnixTimestamp;
  getUnixTodayEnd(): UnixTimestamp;
}

export const ITimeUtilsType = Symbol.for("ITimeUtils");
