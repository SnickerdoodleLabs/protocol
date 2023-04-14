import { EDataWalletPermission } from "@objects/enum/index.js";
import { DomainName, EVMContractAddress, TokenId } from "@objects/primitives/index.js";
import { DataPermissions } from "@objects/index.js";

export class PermissionsUpdatedEvent {
  public constructor(
    public consentContract: EVMContractAddress,
    public tokenId: TokenId,
    public updatedPermissions: DataPermissions,
  ) {}
}
