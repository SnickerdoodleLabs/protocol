import { ECloudStorageType } from "@objects/enum/index.js";

export class CloudStorageActivatedEvent {
  public constructor(public platform: ECloudStorageType) {}
}
