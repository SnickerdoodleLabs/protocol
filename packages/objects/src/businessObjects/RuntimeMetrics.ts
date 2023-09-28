import { BackupStat } from "@objects/businessObjects/BackupStat.js";
import { ComponentStatus } from "@objects/businessObjects/ComponentStatus.js";
import { StatSummary } from "@objects/businessObjects/StatSummary.js";
import { EExternalApi } from "@objects/enum/index.js";
import { IpfsCID, UnixTimestamp } from "@objects/primitives/index.js";
import { QueryPerformanceMetrics } from "@objects/businessObjects/QueryPerformanceMetrics.js";
import { QueryPerformanceEvent } from "packages/objects/src/businessObjects/events/query/index.js";
export class RuntimeMetrics {
  public constructor(
    public uptime: number,
    public startTime: UnixTimestamp,
    public apiCalls: Map<EExternalApi, StatSummary>,
    public queriesPosted: StatSummary,
    public createdBackupsTotal: StatSummary,
    public createdBackupsByType: StatSummary[],
    public createdBackups: BackupStat[],
    public restoredBackupsTotal: StatSummary,
    public restoredBackupsByType: StatSummary[],
    public restoredBackups: BackupStat[],
    public componentStatus: ComponentStatus,
    public queryPerformanceMetrics : QueryPerformanceMetrics[],
    public queryErrors : Record<IpfsCID, QueryPerformanceEvent[]>
  ) {}
}
