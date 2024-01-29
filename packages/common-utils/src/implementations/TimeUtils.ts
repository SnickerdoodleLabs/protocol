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

  public getMillisecondNow(): MillisecondTimestamp {
    return MillisecondTimestamp(Date.now());
  }

  public getISO8601TimeString(
    time = MillisecondTimestamp(Date.now()),
  ): ISO8601DateString {
    return ISO8601DateString(new Date(time).toISOString());
  }

  public convertTimestampToISOString(
    unixTimestamp: UnixTimestamp,
  ): ISO8601DateString {
    const date = new Date(unixTimestamp * 1000);
    return ISO8601DateString(date.toISOString());
  }

  getUnixTodayStart(): UnixTimestamp {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return UnixTimestamp(Math.floor(date.getTime() / 1000));
  }
  getUnixTodayEnd(): UnixTimestamp {
    const date = new Date();
    date.setHours(23, 59, 59, 999);
    return UnixTimestamp(Math.floor(date.getTime() / 1000));
  }
}
