import {
  MillisecondTimestamp,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";

export interface ITimeUtils {
  getUnixNow(): UnixTimestamp;
  getISO8601TimeString(time: MillisecondTimestamp): string;
  parseToDate(dateStr: string): Date | null;
  parseToSDTimestamp(dateStr: string): UnixTimestamp | null;
}

export const ITimeUtilsType = Symbol.for("ITimeUtils");
