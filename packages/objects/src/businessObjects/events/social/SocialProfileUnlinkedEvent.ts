import { ESocialType } from "@objects/enum/index.js";
import { SocialMediaID } from "@objects/primitives/index.js";

export class SocialProfileUnlinkedEvent {
  public constructor(public platform: ESocialType, public id: SocialMediaID) {}
}
