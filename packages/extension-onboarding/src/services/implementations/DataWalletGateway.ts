import { DataWalleProfileService } from "@extension-onboarding/services/implementations/business/DataWalletProfileService";
import { DataWalletProfileRepository } from "@extension-onboarding/services/implementations/data/DataWalletProfileRepository";
import { IDataWalletProfileService } from "@extension-onboarding/services/interfaces/business/IDataWalletProfileService";
import { IDataWalletProfileRepository } from "@extension-onboarding/services/interfaces/data/IDataWalletProfileRepository";

export class DataWalletGateway {
  public profileService: IDataWalletProfileService;
  private profileRepository: IDataWalletProfileRepository;
  constructor() {
    this.profileRepository = new DataWalletProfileRepository();
    this.profileService = new DataWalleProfileService(this.profileRepository);
  }
}
