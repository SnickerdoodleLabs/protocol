import { DataPermissions } from "@objects/businessObjects/DataPermissions.js";
import { EVMContractAddress } from "@objects/primitives/EVMContractAddress.js";

export class DataPermissionsUpdatedEvent {
  public constructor(
    public consentContractAddress: EVMContractAddress,
    public dataPermissions: DataPermissions,
  ) {}
}
