import { VersionedObject } from "@objects/businessObjects/versioned/index.js";
import { ERewardType } from "@objects/enum/index.js";
import { IpfsCID } from "@objects/primitives/index.js";

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
