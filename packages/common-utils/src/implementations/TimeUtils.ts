import { ISO8601DateString, UnixTimestamp } from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";

import { ITimeUtils } from "@common-utils/interfaces";

@injectable()
export class TimeUtils implements ITimeUtils {
  protected lastBlockchainCheck: UnixTimestamp | undefined;
  protected lastBlockchainTimestamp: UnixTimestamp | undefined;
  constructor() {}

  public getUnixNow(): UnixTimestamp {
    return UnixTimestamp(Math.floor(Date.now() / 1000));
  }
  public getUnixNowMS(): UnixTimestamp {
    return UnixTimestamp(Date.now());
  }
  public getISO8601TimeString(time = Date.now()): ISO8601DateString {
    return ISO8601DateString(new Date(time).toISOString());
  }
}
