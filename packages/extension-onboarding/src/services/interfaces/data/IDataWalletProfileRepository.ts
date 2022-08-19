import { PII } from "@extension-onboarding/services/interfaces/objects/";

export interface IDataWalletProfileRepository {
  getProfile(): Promise<PII>;
  setProfile(values: Partial<PII>): Promise<void>;
}
