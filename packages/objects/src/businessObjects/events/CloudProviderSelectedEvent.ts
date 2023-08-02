import { SocialProfile } from "@objects/businessObjects/versioned/SocialProfile.js";
import { ECloudStorageType, ESocialType } from "@objects/enum/index.js";

export class CloudProviderSelectedEvent {
  public constructor(public platform: ECloudStorageType) {}
}
