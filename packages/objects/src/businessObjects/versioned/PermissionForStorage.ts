import { OptInInfo } from "@objects/businessObjects/OptInInfo.js";
import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/VersionedObject.js";
import { EWalletDataType } from "@objects/enum";
import {
  EVMContractAddress,
  IpfsCID,
  TokenId,
} from "@objects/primitives/index.js";
import { PropertiesOf } from "@objects/utilities/index.js";

export class PermissionForStorage extends VersionedObject {
  public static CURRENT_VERSION = 1;
  public constructor(
    public consentAddress: EVMContractAddress,
    public permissions: EWalletDataType[],
    public questionnaireCIDs: IpfsCID[],
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
      data.permissions,
      data.questionnaireCIDs,
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
