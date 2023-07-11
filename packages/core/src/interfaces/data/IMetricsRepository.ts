import {
  StatSummary,
  EExternalApi,
  StorageKey,
  DataWalletBackupID,
  BackupFileName,
  EDataStorageType,
  BackupStat,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IMetricsRepository {
  recordApiCall(api: EExternalApi): ResultAsync<void, never>;
  recordQueryPosted(): ResultAsync<void, never>;
  getApiStatSummaries(): ResultAsync<StatSummary[], never>;
  
  getCreatedBackupsSummary(): ResultAsync<StatSummary, never>;
  getCreatedBackupsByTypeSummary(): ResultAsync<StatSummary[], never>;
  getCreatedBackups(): ResultAsync<BackupStat[], never>;
  
  getRestoredBackupsSummary(): ResultAsync<StatSummary, never>;
  getRestoredBackupsByTypeSummary(): ResultAsync<StatSummary[], never>;
  getRestoredBackups(): ResultAsync<BackupStat[], never>;
  
  getQueriesPostedSummary(): ResultAsync<StatSummary, never>;


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
