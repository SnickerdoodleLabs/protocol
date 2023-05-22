import { EExternalApi } from "@objects/enum/index.js";
import { UnixTimestamp } from "@objects/primitives/index.js";

export class RuntimeMetrics {
  public constructor(
    public uptime: number,
    public startTime: UnixTimestamp,
    public apiCalls: Map<EExternalApi, number>,
  ) {}
}
