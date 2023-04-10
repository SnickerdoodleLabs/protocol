import {
  DiscordProfile,
  DiscordProfileMigrator,
} from "@objects/businessObjects/discord/DiscordProfile.js";
import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/VersionedObject.js";
import { ESocialType } from "@objects/enum/ESocialType.js";
import { SocialPrimaryKey } from "@objects/primitives/index.js";

export abstract class SocialProfile extends VersionedObject {
  public static CURRENT_VERSION = 1;
  public constructor(public pKey: SocialPrimaryKey, public type: ESocialType) {
    super();
  }
}

export class InvalidSocialProfile extends SocialProfile {
  public static CURRENT_VERSION = 1;
  public constructor(public pKey: SocialPrimaryKey, public type: ESocialType) {
    super(pKey, type);
  }
  public getVersion(): number {
    return DiscordProfile.CURRENT_VERSION;
  }
}

export class SocialProfileMigrator extends VersionedObjectMigrator<SocialProfile> {
  public getCurrentVersion(): number {
    return SocialProfile.CURRENT_VERSION;
  }

  protected discordMigrator: DiscordProfileMigrator;

  public constructor() {
    super();
    this.discordMigrator = new DiscordProfileMigrator();
  }

  protected factory(data: Record<string, unknown>): SocialProfile {
    switch (data["type"]) {
      case ESocialType.DISCORD:
        return this.discordMigrator.factory(data);
        break;
    }
    return new InvalidSocialProfile(
      SocialPrimaryKey(data["pKey"] as string),
      ESocialType[data["type"] as string],
    );
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
}
