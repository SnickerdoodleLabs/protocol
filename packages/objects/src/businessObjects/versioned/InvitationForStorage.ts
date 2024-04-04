import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/VersionedObject.js";
import { EVMContractAddress } from "@objects/primitives/index.js";
import { PropertiesOf } from "@objects/utilities/index.js";

export class InvitationForStorage extends VersionedObject {
  public static CURRENT_VERSION = 1;
  public constructor(public consentContractAddress: EVMContractAddress) {
    super();
  }

  public getVersion(): number {
    return InvitationForStorage.CURRENT_VERSION;
  }
}

export class InvitationForStorageMigrator extends VersionedObjectMigrator<InvitationForStorage> {
  protected factory(
    data: PropertiesOf<InvitationForStorage>,
  ): InvitationForStorage {
    return new InvitationForStorage(data.consentContractAddress);
  }
  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
  public getCurrentVersion(): number {
    return InvitationForStorage.CURRENT_VERSION;
  }
}
