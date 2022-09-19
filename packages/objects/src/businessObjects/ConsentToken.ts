import { DataPermissions } from "@objects/businessObjects/DataPermissions";
import {
  EVMAccountAddress,
  EVMContractAddress,
  TokenId,
} from "@objects/primitives";

export class ConsentToken {
  public constructor(
    public consentContractAddress: EVMContractAddress,
    public ownerAddress: EVMAccountAddress,
    public tokenId: TokenId,
    public dataPermissions: DataPermissions,
  ) {}
}
