import { EDataWalletPermission } from "@objects/enum/index.js";
import { DomainName } from "@objects/primitives/index.js";

export class PermissionsRequestedEvent {
  public constructor(
    public domain: DomainName,
    public existingPermissions: EDataWalletPermission[],
    public requestedPermissions: EDataWalletPermission[],
  ) {}
}
