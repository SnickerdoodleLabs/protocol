import { RuntimeMetrics } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared/objects/errors";

export interface IMetricsService {
  getMetrics(): ResultAsync<RuntimeMetrics, SnickerDoodleCoreError>;
}

export const IMetricsServiceType = Symbol.for("IMetricsService");
