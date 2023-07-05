import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/VersionedObject.js";
import {
  EVMContractAddress,
  UnixTimestamp,
} from "@objects/primitives/index.js";

/**
 * This represents an invitation that has been rejected- either temporarily or permanently
 */
export class RejectedInvitation extends VersionedObject {
  public static CURRENT_VERSION = 1;
  public constructor(
    public consentContractAddress: EVMContractAddress,
    public rejectUntil: UnixTimestamp | null,
  ) {
    super();
  }

  public getVersion(): number {
    return RejectedInvitation.CURRENT_VERSION;
  }
}

export class RejectedInvitationMigrator extends VersionedObjectMigrator<RejectedInvitation> {
  public getCurrentVersion(): number {
    return RejectedInvitation.CURRENT_VERSION;
  }

  protected factory(data: Record<string, unknown>): RejectedInvitation {
    return new RejectedInvitation(
      data["consentContractAddress"] as EVMContractAddress,
      data["rejectUntil"] as UnixTimestamp | null,
    );
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map([]);
  }
}
