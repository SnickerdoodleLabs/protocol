import { PII } from "@extension-onboarding/services/interfaces/objects/";
import { ResultAsync } from "neverthrow";

export interface IDataWalletProfileRepository {
  getProfile(): ResultAsync<PII, unknown>;
  setProfile(values: Partial<PII>): Promise<void>;
}
