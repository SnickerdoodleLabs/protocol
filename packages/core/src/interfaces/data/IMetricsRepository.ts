import {
  StatSummary,
  EExternalApi,
  StorageKey,
  DataWalletBackupID,
  BackupFileName,
  EDataStorageType,
  BackupStat,
  EQueryEvents,
  QueryPerformanceMetrics,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { QueryPerformanceEvent } from "packages/objects/src/businessObjects/events/query";

export interface IMetricsRepository {
  recordApiCall(api: EExternalApi): ResultAsync<void, never>;
  recordQueryPosted(): ResultAsync<void, never>;
  recordQueryPerformanceEvent(
    event: QueryPerformanceEvent,
    elapsed: number,
  ): void;
  createQueryPerformanceStorage(eventName: EQueryEvents): void;

  getApiStatSummaries(): ResultAsync<StatSummary[], never>;
  getCreatedBackupsSummary(): ResultAsync<StatSummary, never>;
  getCreatedBackupsByTypeSummary(): ResultAsync<StatSummary[], never>;
  getCreatedBackups(): ResultAsync<BackupStat[], never>;

  getRestoredBackupsSummary(): ResultAsync<StatSummary, never>;
  getRestoredBackupsByTypeSummary(): ResultAsync<StatSummary[], never>;
  getRestoredBackups(): ResultAsync<BackupStat[], never>;

  getQueriesPostedSummary(): ResultAsync<StatSummary, never>;
  getQueryPerformanceData(): QueryPerformanceMetrics[];

  recordBackupCreated(
    storageType: EDataStorageType,
    dataType: StorageKey,
    backupId: DataWalletBackupID,
    name: BackupFileName,
  ): ResultAsync<void, never>;
  recordBackupRestored(
    storageType: EDataStorageType,
    dataType: StorageKey,
    backupId: DataWalletBackupID,
    name: BackupFileName,
  ): ResultAsync<void, never>;
}
export const IMetricsRepositoryType = Symbol.for("IMetricsRepository");
