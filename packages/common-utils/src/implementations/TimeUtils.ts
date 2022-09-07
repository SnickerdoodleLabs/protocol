import { UnixTimestamp } from "@snickerdoodlelabs/objects";
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
  public getISO8601TimeString(time = Date.now()): string {
    return new Date(time).toISOString()
  }
}
