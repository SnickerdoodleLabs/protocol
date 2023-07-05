import { ResultAsync } from "neverthrow";

import { PII } from "@extension-onboarding/services/interfaces/objects/";

export interface IDataWalletProfileRepository {
  getProfile(): ResultAsync<PII, unknown>;
  setProfile(values: Partial<PII>): Promise<void>;
}
