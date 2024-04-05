import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/VersionedObject.js";
import { EWalletDataType } from "@objects/enum/index.js";
import { EVMContractAddress, IpfsCID } from "@objects/primitives/index.js";
import { PropertiesOf } from "@objects/utilities/index.js";

export class PermissionForStorage extends VersionedObject {
  public static CURRENT_VERSION = 1;
  public constructor(
    public consentAddress: EVMContractAddress,
    public virtual: EWalletDataType[],
    public questionnaires: IpfsCID[],
  ) {
    super();
  }

  public getVersion(): number {
    return PermissionForStorage.CURRENT_VERSION;
  }
}

export class PermissionForStorageMigrator extends VersionedObjectMigrator<PermissionForStorage> {
  protected factory(
    data: PropertiesOf<PermissionForStorage>,
  ): PermissionForStorage {
    return new PermissionForStorage(
      data.consentAddress,
      data.virtual,
      data.questionnaires,
    );
  }
  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
  public getCurrentVersion(): number {
    return PermissionForStorage.CURRENT_VERSION;
  }
}
