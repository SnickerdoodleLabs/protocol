import { DataWalleProfileService } from "@extension-onboarding/services/implementations/business";
import { DataWalletProfileRepository } from "@extension-onboarding/services/implementations/data";
import { IDataWalletProfileService } from "@extension-onboarding/services/interfaces/business";
import { IDataWalletProfileRepository } from "@extension-onboarding/services/interfaces/data";

export class DataWalletGateway {
  public profileService: IDataWalletProfileService;
  private profileRepository: IDataWalletProfileRepository;
  constructor() {
    this.profileRepository = new DataWalletProfileRepository();
    this.profileService = new DataWalleProfileService(this.profileRepository);
  }
}
