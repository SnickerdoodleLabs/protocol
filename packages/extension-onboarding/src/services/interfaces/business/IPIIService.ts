import { AjaxError } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { PII } from "../objects";

export interface IPIIService {
  fetchPIIFromGoogle(
    auth_token: string,
    googleId: string,
  ): ResultAsync<PII, AjaxError>;
}
