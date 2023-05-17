import { ApiName, UnixTimestamp } from "..";

export class RuntimeMetrics {
  public constructor(
    public uptime: number,
    public startTime: UnixTimestamp,
    public apiCalls: { [apiName: ApiName]: number },
  ) {}
}
