import { IDataWalletProfileService } from "@extension-onboarding/services/interfaces/business/IDataWalletProfileService";
import { IDataWalletProfileRepository } from "@extension-onboarding/services/interfaces/data/IDataWalletProfileRepository";
import { PII } from "@extension-onboarding/services/interfaces/objects/";

export class DataWalleProfileService implements IDataWalletProfileService {
  constructor(
    protected dataWalleProfileRepository: IDataWalletProfileRepository,
  ) {}
  public getProfile(): Promise<PII> {
    return this.dataWalleProfileRepository.getProfile();
  }
  public setProfile(values: Partial<PII>): Promise<void> {
    return this.dataWalleProfileRepository.setProfile(values);
  }
}
