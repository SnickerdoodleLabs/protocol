import { EDataWalletPermission } from "@objects/enum/index.js";
import { DomainName } from "@objects/primitives/index.js";

export class PermissionsGrantedEvent {
  public constructor(
    public domain: DomainName,
    public permissions: EDataWalletPermission[],
  ) {}
}
