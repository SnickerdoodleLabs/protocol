import { ECloudStorageType } from "@objects/enum/index.js";

export class CloudProviderActivatedEvent {
  public constructor(public platform: ECloudStorageType) {}
}
