import { ApiStats, EExternalApi } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IMetricsRepository {
  recordApiCall(api: EExternalApi): ResultAsync<void, never>;
  getApiStats(): ResultAsync<ApiStats[], never>;
}
export const IMetricsRepositoryType = Symbol.for("IMetricsRepository");
