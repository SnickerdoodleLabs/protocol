import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/VersionedObject.js";
import { EWalletDataType } from "@objects/enum/index.js";
import { EVMContractAddress, IpfsCID } from "@objects/primitives/index.js";
import { PropertiesOf } from "@objects/utilities/index.js";

export class Permission extends VersionedObject {
  public static CURRENT_VERSION = 1;
  public constructor(
    public consentContractAddress: EVMContractAddress,
    public virtual: EWalletDataType[],
    public questionnaires: IpfsCID[],
    public queryBasedPermissions: Record<
      IpfsCID,
      { virtual: EWalletDataType[]; questionnaires: IpfsCID[] } | undefined
    > = {},
  ) {
    super();
  }

  public getVersion(): number {
    return Permission.CURRENT_VERSION;
  }
}

export class PermissionMigrator extends VersionedObjectMigrator<Permission> {
  protected factory(data: PropertiesOf<Permission>): Permission {
    return new Permission(
      data.consentContractAddress,
      data.virtual,
      data.questionnaires,
      data.queryBasedPermissions,
    );
  }
  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
  public getCurrentVersion(): number {
    return Permission.CURRENT_VERSION;
  }
}
