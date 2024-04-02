import { DataPermissions } from "@objects/businessObjects/DataPermissions.js";
import { Permission } from "@objects/businessObjects/versioned/Permission.js";
import { EVMContractAddress } from "@objects/primitives/index.js";

export class DataPermissionsUpdatedEvent {
  public constructor(
    public consentContractAddress: EVMContractAddress,
    public dataPermissions: Permission,
  ) {}
}
