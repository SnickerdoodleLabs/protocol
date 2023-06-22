import { StatSummary, EExternalApi } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IMetricsRepository {
  recordApiCall(api: EExternalApi): ResultAsync<void, never>;
  recordRestoredBackup(): ResultAsync<void, never>;
  recordQueryPosted(): ResultAsync<void, never>;
  getApiStatSummaries(): ResultAsync<StatSummary[], never>;
  getRestoredBackupSummary(): ResultAsync<StatSummary, never>;
  getQueriesPostedSummary(): ResultAsync<StatSummary, never>;
}
export const IMetricsRepositoryType = Symbol.for("IMetricsRepository");
