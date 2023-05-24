import { ResultAsync } from "neverthrow";

import { EComponentStatus } from "@objects/businessObjects";
import { EChain } from "@objects/enum";
import { AjaxError } from "@objects/errors";

export interface IIndexer {
  getHealthCheck(): ResultAsync<EComponentStatus, AjaxError>;
  healthStatus(): EComponentStatus;
  getSupportedChains(): Array<EChain>;
}
