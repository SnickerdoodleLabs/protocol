import { ITimeUtils } from "@snickerdoodlelabs/common-utils";
import {
  UnixTimestamp,
  MillisecondTimestamp,
  Year,
  Month,
  ISO8601DateString,
} from "@snickerdoodlelabs/objects";

export class MockTimeUtils implements ITimeUtils {
  public getUnixNow(): UnixTimestamp {
    throw new Error("Method not implemented.");
  }
  public getMillisecondNow(): MillisecondTimestamp {
    throw new Error("Method not implemented.");
  }
  public getISO8601TimeString(time: MillisecondTimestamp): string {
    throw new Error("Method not implemented.");
  }
  public parseToDate(dateStr: string): Date | null {
    throw new Error("Method not implemented.");
  }
  public parseToSDTimestamp(dateStr: string): UnixTimestamp | null {
    throw new Error("Method not implemented.");
  }
  public getCurYear(): Year {
    throw new Error("Method not implemented.");
  }
  public getCurMonth(): Month {
    throw new Error("Method not implemented.");
  }
  public convertTimestampToISOString(
    unixTimestamp: UnixTimestamp,
  ): ISO8601DateString {
    throw new Error("Method not implemented.");
  }
  public getUnixTodayStart(): UnixTimestamp {
    throw new Error("Method not implemented.");
  }
  public getUnixTodayEnd(): UnixTimestamp {
    throw new Error("Method not implemented.");
  }
}
