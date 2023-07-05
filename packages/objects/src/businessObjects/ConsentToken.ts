import { DataPermissions } from "@objects/businessObjects/DataPermissions.js";
import {
  EVMAccountAddress,
  EVMContractAddress,
  TokenId,
} from "@objects/primitives/index.js";

export class ConsentToken {
  public constructor(
    public consentContractAddress: EVMContractAddress,
    public ownerAddress: EVMAccountAddress,
    public tokenId: TokenId,
    public dataPermissions: DataPermissions,
  ) {}
}
