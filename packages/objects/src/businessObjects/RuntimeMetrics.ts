import { ApiStats } from "@objects/businessObjects/ApiStats.js";
import { EExternalApi } from "@objects/enum/index.js";
import { UnixTimestamp } from "@objects/primitives/index.js";

export class RuntimeMetrics {
  public constructor(
    public uptime: number,
    public startTime: UnixTimestamp,
    public apiCalls: Map<EExternalApi, ApiStats>,
  ) {}
}
