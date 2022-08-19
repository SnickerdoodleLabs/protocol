import { PII } from "@extension-onboarding/services/interfaces/objects/";

export interface IDataWalletProfileService {
  getProfile(): Promise<PII>;
  setProfile(values: Partial<PII>): Promise<void>;
}
