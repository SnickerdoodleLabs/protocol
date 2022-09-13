import { UnixTimestamp } from "@snickerdoodlelabs/objects";

export interface ITimeUtils {
  getUnixNow(): UnixTimestamp;
  getUnixNowMS(): UnixTimestamp;
  getISO8601TimeString(time: number): string;
}

export const ITimeUtilsType = Symbol.for("ITimeUtils");
