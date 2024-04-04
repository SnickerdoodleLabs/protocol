import { OptInInfo } from "@objects/businessObjects/OptInInfo.js";
import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/VersionedObject.js";
import { EVMContractAddress, TokenId } from "@objects/primitives/index.js";
import { PropertiesOf } from "@objects/utilities/index.js";

export class InvitationForStorage extends VersionedObject {
  public static CURRENT_VERSION = 1;
  public constructor(
    public consentContractAddress: EVMContractAddress,
    public tokenId: string,
  ) {
    super();
  }

  public getVersion(): number {
    return InvitationForStorage.CURRENT_VERSION;
  }

  static toInvitation(src: InvitationForStorage): OptInInfo {
    return new OptInInfo(
      src.consentContractAddress,
      TokenId(BigInt(src.tokenId)),
    );
  }

  static fromOptInInfo(src: OptInInfo): InvitationForStorage {
    return new InvitationForStorage(
      src.consentContractAddress,
      src.tokenId.toString(),
    );
  }
}

export class InvitationForStorageMigrator extends VersionedObjectMigrator<InvitationForStorage> {
  protected factory(
    data: PropertiesOf<InvitationForStorage>,
  ): InvitationForStorage {
    return new InvitationForStorage(data.consentContractAddress, data.tokenId);
  }
  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
  public getCurrentVersion(): number {
    return InvitationForStorage.CURRENT_VERSION;
  }
}
