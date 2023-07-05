import { EarnedReward } from "@objects/businessObjects/rewards/EarnedReward.js";
import { ECredentialType, ERewardType } from "@objects/enum/index.js";
import { IpfsCID, URLString, Web2Credential } from "@objects/primitives/index.js";

export class Web2Reward extends EarnedReward {
  constructor(
    readonly queryCID: IpfsCID,
    readonly name: string,
    readonly image: IpfsCID | null,
    readonly description: string,
    readonly url: URLString,
    readonly credentialType: ECredentialType,
    readonly credential: Web2Credential,
    readonly instructions: string,
  ) {
    super(queryCID, name, image, description, ERewardType.Direct);
  }
}
