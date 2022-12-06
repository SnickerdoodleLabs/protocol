import { EarnedReward } from "@objects/businessObjects/rewards/EarnedReward";
import { ECredentialType, ERewardType } from "@objects/enum";
import { IpfsCID, URLString, Web2Credential } from "@objects/primitives";

export class Web2Reward extends EarnedReward {

    constructor(
        readonly name: string,
        readonly image: IpfsCID,
        readonly queryCID: IpfsCID,
        readonly url: URLString,
        readonly credentialType: ECredentialType,
        readonly credential: Web2Credential,
        readonly instructions: string
    ) {
        super(name, image, queryCID, ERewardType.Direct);
    }

}
