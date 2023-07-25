import { DataWalleProfileService } from "@extension-onboarding/services/implementations/business";
import { DataWalletProfileRepository } from "@extension-onboarding/services/implementations/data";
import { IDataWalletProfileService } from "@extension-onboarding/services/interfaces/business";
import { IDataWalletProfileRepository } from "@extension-onboarding/services/interfaces/data/index.js";
import { ISdlDataWallet } from "@snickerdoodlelabs/objects";

export class DataWalletGateway {
  public profileService: IDataWalletProfileService;
  private profileRepository: IDataWalletProfileRepository;
  constructor(private sdlDataWallet: ISdlDataWallet) {
    this.profileRepository = new DataWalletProfileRepository(sdlDataWallet);
    this.profileService = new DataWalleProfileService(this.profileRepository);
  }
}
