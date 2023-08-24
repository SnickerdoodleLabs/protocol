import {
  ISO8601DateString,
  MillisecondTimestamp,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";

import { ITimeUtils } from "@common-utils/interfaces/index.js";

@injectable()
export class TimeUtils implements ITimeUtils {
  protected lastBlockchainCheck: UnixTimestamp | undefined;
  protected lastBlockchainTimestamp: UnixTimestamp | undefined;
  constructor() {}

  public getUnixNow(): UnixTimestamp {
    return UnixTimestamp(Math.floor(Date.now() / 1000));
  }
  public getISO8601TimeString(
    time = MillisecondTimestamp(Date.now()),
  ): ISO8601DateString {
    return ISO8601DateString(new Date(time).toISOString());
  }

  public parseToDate(dateStr: string): Date | null {
    // we cannot create a date object directly as it creates an unknown object incase of invalid input
    const time = this.parseToSDTimestamp(dateStr);
    if (time == null) {
      return null;
    }
    return new Date(time);
  }

  public parseToSDTimestamp(dateStr: string): UnixTimestamp | null {
    const time = Date.parse(dateStr);
    if (isNaN(time)) {
      return null;
    }
    return UnixTimestamp(Math.floor(time / 1000));
  }
}
