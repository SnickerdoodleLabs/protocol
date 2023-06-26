import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/index.js";
import { ERecordKey } from "@objects/enum/index.js";
import {
  EVMContractAddress,
  UnixTimestamp,
  VolatileStorageKey,
} from "@objects/primitives/index.js";

/**
 * This represents an invitation that has been rejected- either temporarily or permanently
 */
export class RejectedInvitation extends VersionedObject {
  public get primaryKey(): VolatileStorageKey {
    return this.consentContractAddress;
  }
  public constructor(
    public consentContractAddress: EVMContractAddress,
    public rejectUntil: UnixTimestamp | null,
  ) {
    super();
  }

  public static CURRENT_VERSION = 1;
  public getVersion(): number {
    return RejectedInvitation.CURRENT_VERSION;
  }
}

export class RejectedInvitationMigrator extends VersionedObjectMigrator<RejectedInvitation> {
  public getCurrentVersion(): number {
    return RejectedInvitation.CURRENT_VERSION;
  }

  public factory(data: Record<string, unknown>): RejectedInvitation {
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

export class RealmRejectedInvitation extends Realm.Object<RealmRejectedInvitation> {
  primaryKey!: string;
  consentContractAddress!: string;
  rejectUntil!: number | null;

  static schema = {
    name: ERecordKey.REJECTED_INVITATIONS,
    properties: {
      primaryKey: "string",
      consentContractAddress: "string",
      rejectUntil: "int?",
    },
    primaryKey: "primaryKey",
  };
}
