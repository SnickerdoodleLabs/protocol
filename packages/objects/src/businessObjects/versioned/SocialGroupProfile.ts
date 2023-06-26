import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/index.js";
import { ESocialType } from "@objects/enum/index.js";
import {
  DiscordID,
  Integer,
  ISO8601DateString,
  SocialPrimaryKey,
  UnixTimestamp,
  URLString,
  Username,
} from "@objects/primitives/index.js";

export abstract class SocialGroupProfile extends VersionedObject {
  public static CURRENT_VERSION = 1;
  public constructor(
    public primaryKey: SocialPrimaryKey,
    public type: ESocialType,
    public ownerId?: SocialPrimaryKey,
  ) {
    super();
  }
}

export class InvalidSocialGroupProfile extends SocialGroupProfile {
  public static CURRENT_VERSION = 1;
  public constructor(
    public primaryKey: SocialPrimaryKey,
    public type: ESocialType,
    public ownerId: SocialPrimaryKey,
  ) {
    super(primaryKey, type, ownerId);
  }
  public getVersion(): number {
    return InvalidSocialGroupProfile.CURRENT_VERSION;
  }
}

export class SocialGroupProfileMigrator extends VersionedObjectMigrator<SocialGroupProfile> {
  public getCurrentVersion(): number {
    return SocialGroupProfile.CURRENT_VERSION;
  }

  protected discordMigrator = new DiscordGuildProfileMigrator();

  public constructor() {
    super();
  }

  public factory(data: Record<string, unknown>): SocialGroupProfile {
    switch (data["type"]) {
      case ESocialType.DISCORD:
        return this.discordMigrator.factory(data);
    }
    return new InvalidSocialGroupProfile( // Cannot return null
      SocialPrimaryKey(data["primaryKey"] as string),
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

export class DiscordGuildProfile extends SocialGroupProfile {
  public static CURRENT_VERSION = 1;

  public constructor(
    public id: DiscordID,
    public discordUserProfileId: DiscordID | undefined, // this should be translated to ownerId
    public name: string,
    public isOwner: boolean,
    public permissions: Integer,
    public icon: URLString | null,
    public joinedAt: UnixTimestamp | null,
  ) {
    super(
      SocialPrimaryKey(`discord-group-${id}`),
      ESocialType.DISCORD,
      discordUserProfileId
        ? SocialPrimaryKey(`discord-${discordUserProfileId}`)
        : undefined,
    );
  }

  public deriveKey(id: DiscordID): SocialPrimaryKey {
    return SocialPrimaryKey(`discord-group-${id}`);
  }

  public getVersion(): number {
    return DiscordGuildProfile.CURRENT_VERSION;
  }
}
export interface DiscordGuildProfileAPIResponse {
  id: DiscordID;
  name: string;
  icon: URLString;
  owner: boolean;
  permissions: Integer;
}

//TODO add needed fields only
export interface DiscordGuildMembershipAPIResponse {
  is_pending: boolean;
  joined_at: ISO8601DateString;
  user: {
    id: DiscordID;
    username: Username;
  };
}
export class DiscordGuildProfileMigrator {
  public factory(data: Record<string, unknown>): DiscordGuildProfile {
    return new DiscordGuildProfile(
      DiscordID(data["id"] as string),
      DiscordID(data["discordUserProfileId"] as string),
      Username(data["name"] as string),
      data["isOwner"] as boolean,
      Integer(data["permissions"] as number),
      data["icon"] as URLString,
      UnixTimestamp(data["joinedAt"] as number),
    );
  }
}
