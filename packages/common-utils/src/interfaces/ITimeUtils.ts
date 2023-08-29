import {
  MillisecondTimestamp,
  Month,
  UnixTimestamp,
  Year,
} from "@snickerdoodlelabs/objects";

export interface ITimeUtils {
  getUnixNow(): UnixTimestamp;
  getISO8601TimeString(time: MillisecondTimestamp): string;
  parseToDate(dateStr: string): Date | null;
  parseToSDTimestamp(dateStr: string): UnixTimestamp | null;

  getCurYear(): Year;
  getCurMonth(): Month;
}

export const ITimeUtilsType = Symbol.for("ITimeUtils");
