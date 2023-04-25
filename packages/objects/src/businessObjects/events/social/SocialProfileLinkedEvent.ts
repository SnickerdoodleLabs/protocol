import { SocialProfile } from "@objects/businessObjects/index.js";
import { ESocialType } from "@objects/enum/index.js";

export class SocialProfileLinkedEvent {
  public constructor(
    public platform: ESocialType,
    public profile: SocialProfile,
  ) {}
}
