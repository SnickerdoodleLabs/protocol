import { EarnedReward } from "@objects/businessObjects/rewards/EarnedReward.js";
import { Web2Reward } from "@objects/businessObjects/rewards/Web2Reward.js";
import { VersionedObjectMigrator } from "@objects/businessObjects/versioned/VersionedObject.js";
import { ERewardType } from "@objects/enum/ERewardType.js";
import { PropertiesOf } from "@objects/utilities/index.js";

export class EarnedRewardMigrator extends VersionedObjectMigrator<EarnedReward> {
  public getCurrentVersion(): number {
    return EarnedReward.CURRENT_VERSION;
  }

  protected factory(data: PropertiesOf<EarnedReward>): EarnedReward {
    switch (data.type) {
      case ERewardType.Web2: {
        const web2Reward = data as PropertiesOf<Web2Reward>;
        return new Web2Reward(
          web2Reward.queryCID,
          web2Reward.name,
          web2Reward.image,
          web2Reward.description,
          web2Reward.url,
          web2Reward.credentialType,
          web2Reward.credential,
          web2Reward.instructions,
        );
      }

      default:
        throw new Error(`TODO`);
    }
    //return new EarnedReward(data.queryCID, data.name, data.type);
    //   data.image,
    //   data.description,
    //   data.contractAddress,
    //   data.type,
    // );
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
}
