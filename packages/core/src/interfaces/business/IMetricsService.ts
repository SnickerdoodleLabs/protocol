import { RuntimeMetrics } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

/**
 * The MetricsService provides access to runtime metrics for the core, such as the number
 * of api calls made.
 */
export interface IMetricsService {
  getMetrics(): ResultAsync<RuntimeMetrics, never>;
  getUnlocked(): ResultAsync<boolean, never>;
  initialize(): ResultAsync<void, never>;
}

export const IMetricsServiceType = Symbol.for("IMetricsService");
