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
  parseToDate(dateStr: string): Date | null;
  parseToSDTimestamp(dateStr: string): UnixTimestamp | null;

  getCurYear(): Year;
  getCurMonth(): Month;
  convertTimestampToISOString(unixTimestamp: UnixTimestamp): ISO8601DateString;
  getUnixTodayStart(): UnixTimestamp;
  getUnixTodayEnd(): UnixTimestamp;
}

export const ITimeUtilsType = Symbol.for("ITimeUtils");
