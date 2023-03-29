import { SocialGroupProfile } from "@objects/businessObjects/SocialGroupProfile.js";
import { ESocialType } from "@objects/enum/index.js";
import {
  BearerAuthToken,
  ISO8601DateString,
  SocialPrimaryKey,
  UnixTimestamp,
  Username,
} from "@objects/primitives/index.js";
import { Integer } from "@objects/primitives/Integer.js";
import { SnowflakeID } from "@objects/primitives/SnowflakeID.js";

export class DiscordGuildProfile extends SocialGroupProfile {
  public static CURRENT_VERSION = 1;

  public constructor(
    public id: SnowflakeID,
    public name: string,
    public isOwner: boolean,
    public permissions: Integer,
    public icon: string | null,
    public joinedAt: UnixTimestamp | null,
    public discordUserProfileId : SnowflakeID,
    // userId
  ) {
    super(SocialPrimaryKey(`discord-group-${id}`), ESocialType.DISCORD);
  }

  public deriveKey(id: SnowflakeID): SocialPrimaryKey {
    return SocialPrimaryKey(`discord-group-${id}`);
  }

  public getVersion(): number {
    return DiscordGuildProfile.CURRENT_VERSION;
  }
}

export interface DiscordGuildProfileAPIResponse {
  id: SnowflakeID;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: Integer;
}
//TODO add needed fields only
export interface DiscordGuildMembershipAPIResponse {
  is_pending: boolean;
  joined_at: ISO8601DateString;
  user: {
    id: SnowflakeID;
    username: Username;
  };
}
export class DiscordGuildProfileMigrator {
  public factory(data: Record<string, unknown>): DiscordGuildProfile {
    return new DiscordGuildProfile(
      SnowflakeID(data["id"] as string),
      Username(data["name"] as string),
      data["isOwner"] as boolean,
      Integer(data["permissions"] as number),
      data["icon"] as string,
      UnixTimestamp(data["joinedAt"] as number),
      SnowflakeID(data["id"] as string),
    );
  }
}
