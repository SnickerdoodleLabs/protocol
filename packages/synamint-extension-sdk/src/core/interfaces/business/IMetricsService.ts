import { DomainName, RuntimeMetrics } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared/objects/errors";

export interface IMetricsService {
  getMetrics(
    sourceDomain?: DomainName,
  ): ResultAsync<RuntimeMetrics, SnickerDoodleCoreError>;
}

export const IMetricsServiceType = Symbol.for("IMetricsService");
