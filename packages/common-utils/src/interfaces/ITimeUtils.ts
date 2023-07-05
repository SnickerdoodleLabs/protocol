import {
  MillisecondTimestamp,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";

export interface ITimeUtils {
  getUnixNow(): UnixTimestamp;
  getISO8601TimeString(time: MillisecondTimestamp): string;
}

export const ITimeUtilsType = Symbol.for("ITimeUtils");
