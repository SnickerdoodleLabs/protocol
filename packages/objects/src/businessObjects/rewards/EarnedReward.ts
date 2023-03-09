import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/VersionedObject";
import { ERewardType } from "@objects/enum/ERewardType";
import { IpfsCID } from "@objects/primitives";

export class EarnedReward extends VersionedObject {
  public static CURRENT_VERSION = 1;

  constructor(
    readonly queryCID: IpfsCID,
    readonly name: string,
    readonly image: IpfsCID | null,
    readonly description: string,
    readonly type: ERewardType,
  ) {
    super();
  }

  public getVersion(): number {
    return EarnedReward.CURRENT_VERSION;
  }
}

export class EarnedRewardMigrator extends VersionedObjectMigrator<EarnedReward> {
  public getCurrentVersion(): number {
    return EarnedReward.CURRENT_VERSION;
  }

  protected factory(data: Record<string, unknown>): EarnedReward {
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
