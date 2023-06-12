import { ComponentStatus } from "@objects/businessObjects/ComponentStatus.js";
import { StatSummary } from "@objects/businessObjects/StatSummary.js";
import { EExternalApi } from "@objects/enum/index.js";
import { UnixTimestamp } from "@objects/primitives/index.js";

export class RuntimeMetrics {
  public constructor(
    public uptime: number,
    public startTime: UnixTimestamp,
    public apiCalls: Map<EExternalApi, StatSummary>,
    public queriesPosted: StatSummary,
    public backupsRestored: StatSummary,
    public componentStatus: ComponentStatus,
  ) {}
}
