import { OptInInfo } from "@objects/businessObjects/OptInInfo.js";
import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/VersionedObject.js";
import {
  BigNumberString,
  EVMContractAddress,
} from "@objects/primitives/index.js";
import { PropertiesOf } from "@objects/utilities/index.js";

export class InvitationForStorage extends VersionedObject {
  public static CURRENT_VERSION = 1;
  public constructor(
    public consentContractAddress: EVMContractAddress,
    public identityNullifier: BigNumberString,
    public identityTrapdoor: BigNumberString,
  ) {
    super();
  }

  public getVersion(): number {
    return InvitationForStorage.CURRENT_VERSION;
  }

  static toInvitation(src: InvitationForStorage): OptInInfo {
    return new OptInInfo(
      src.consentContractAddress,
      src.identityNullifier,
      src.identityTrapdoor,
    );
  }

  static fromOptInInfo(src: OptInInfo): InvitationForStorage {
    return new InvitationForStorage(
      src.consentContractAddress,
      src.identityNullifier,
      src.identityTrapdoor,
    );
  }
}

export class InvitationForStorageMigrator extends VersionedObjectMigrator<InvitationForStorage> {
  protected factory(
    data: PropertiesOf<InvitationForStorage>,
  ): InvitationForStorage {
    return new InvitationForStorage(
      data.consentContractAddress,
      data.identityNullifier,
      data.identityTrapdoor,
    );
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
