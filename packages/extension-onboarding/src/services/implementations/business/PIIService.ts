import { AjaxError } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { IPIIService } from "@extension-onboarding/services/interfaces/business";
import { IPIIRepository } from "@extension-onboarding/services/interfaces/data/IPIIRepository";
import { PII } from "@extension-onboarding/services/interfaces/objects";

export class PIIService implements IPIIService {
  constructor(public PIIRepository: IPIIRepository) {}
  fetchPIIFromGoogle(
    auth_token: string,
    googleId: string,
  ): ResultAsync<PII, AjaxError> {
    return this.PIIRepository.fetchPIIFromGoogle(auth_token, googleId);
  }
}
