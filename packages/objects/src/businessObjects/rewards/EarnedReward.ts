import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/VersionedObject";
import { ERecordKey } from "@objects/enum";
import { ERewardType } from "@objects/enum/ERewardType";
import { IpfsCID, VolatileStorageKey } from "@objects/primitives";

export class EarnedReward extends VersionedObject {
  public pKey: VolatileStorageKey;

  constructor(
    readonly queryCID: IpfsCID,
    readonly name: string,
    readonly image: IpfsCID | null,
    readonly description: string,
    readonly type: ERewardType,
  ) {
    super();
    this.pKey = EarnedReward.getKey(queryCID, name);
  }

  public static CURRENT_VERSION = 1;
  public getVersion(): number {
    return EarnedReward.CURRENT_VERSION;
  }

  public static getKey(queryCID: IpfsCID, name: string): VolatileStorageKey {
    return `${queryCID}_${name}`;
  }
}

export class EarnedRewardMigrator extends VersionedObjectMigrator<EarnedReward> {
  public getCurrentVersion(): number {
    return EarnedReward.CURRENT_VERSION;
  }

  public factory(data: Record<string, unknown>): EarnedReward {
    return new EarnedReward(
      data["queryCID"] as IpfsCID,
      data["name"] as string,
      data["image"] as IpfsCID,
      data["description"] as string,
      data["type"] as ERewardType,
    );
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
}

export class RealmEarnedReward extends Realm.Object<RealmEarnedReward> {
  pKey!: string;
  queryCID!: string;
  name!: string;
  image!: string | null;
  description!: string;
  type!: string;

  static schema = {
    name: ERecordKey.EARNED_REWARDS,
    properties: {
      pKey: "string",
      queryCID: "string",
      name: "string",
      image: "string?",
      description: "string",
      type: "string",
    },
    primaryKey: "pKey",
  };
}
