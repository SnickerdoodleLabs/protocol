import { SocialProfile } from "@objects/businessObjects/versioned/SocialProfile.js";
import { ESocialType } from "@objects/enum/index.js";

export class CloudProviderSelectedEvent {
    public constructor(
        public platform: ESocialType,
        public profile: SocialProfile,
    ) { }
}
