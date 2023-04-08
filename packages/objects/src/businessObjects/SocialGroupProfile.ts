import {
  DiscordGuildProfile,
  DiscordGuildProfileMigrator,
} from "@objects/businessObjects/discord/DiscordGuildProfile.js";
import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/VersionedObject.js";
import { ESocialType } from "@objects/enum/ESocialType.js";
import { SocialPrimaryKey } from "@objects/primitives/index.js";

export abstract class SocialGroupProfile extends VersionedObject {
  public static CURRENT_VERSION = 1;
  public constructor(
    public pKey: SocialPrimaryKey,
    public type: ESocialType,
    public ownerId: SocialPrimaryKey,
  ) {
    super();
  }
}

export class InvalidSocialGroupProfile extends SocialGroupProfile {
  public static CURRENT_VERSION = 1;
  public constructor(
    public pKey: SocialPrimaryKey,
    public type: ESocialType,
    public ownerId: SocialPrimaryKey,
  ) {
    super(pKey, type, ownerId);
  }
  public getVersion(): number {
    return DiscordGuildProfile.CURRENT_VERSION;
  }
}

export class SocialGroupProfileMigrator extends VersionedObjectMigrator<SocialGroupProfile> {
  public getCurrentVersion(): number {
    return DiscordGuildProfile.CURRENT_VERSION;
  }

  protected discordMigrator: DiscordGuildProfileMigrator;

  public constructor() {
    super();
    this.discordMigrator = new DiscordGuildProfileMigrator();
  }

  protected factory(data: Record<string, unknown>): SocialGroupProfile {
    switch (data["type"]) {
      case ESocialType.DISCORD:
        return this.discordMigrator.factory(data);
        break;
    }
    return new InvalidSocialGroupProfile(
      SocialPrimaryKey(data["pKey"] as string),
      ESocialType[data["type"] as string],
      SocialPrimaryKey(data["ownerId"] as string),
    );
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
}
