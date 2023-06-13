import { AjaxError } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IIndexerHealthCheck {
  healthCheck(): ResultAsync<string, AjaxError>;
}
