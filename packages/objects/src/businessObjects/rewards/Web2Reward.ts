import { EarnedReward } from "@objects/businessObjects/rewards/EarnedReward";
import { ECredentialType, ERewardType } from "@objects/enum";
import { IpfsCID, URLString, Web2Credential } from "@objects/primitives";
import { RewardImage } from "@objects/primitives/RewardImage";

export class Web2Reward extends EarnedReward {

    constructor(
        readonly queryCID: IpfsCID,
        readonly url: URLString,
        readonly credentialType: ECredentialType,
        readonly credential: Web2Credential,
        readonly instructions: string,
        readonly name?: string,
        readonly image?: RewardImage

    ) {
        super(queryCID, ERewardType.Web2, name, image)
    }

}
