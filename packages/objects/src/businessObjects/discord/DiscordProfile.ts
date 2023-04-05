import { OAuth2Tokens } from "@objects/businessObjects/OAuth2Tokens.js";
import { SocialProfile } from "@objects/businessObjects/SocialProfile.js";
import { ESocialType } from "@objects/enum/index.js";
import {
  BearerAuthToken,
  Integer,
  SnowflakeID,
  SocialPrimaryKey,
  UnixTimestamp,
  Username,
} from "@objects/primitives/index.js";

export class DiscordProfile extends SocialProfile {
  public static CURRENT_VERSION = 1;

  public constructor(
    public id: SnowflakeID,
    public username: Username,
    public displayName: string | null,
    public discriminator: string,
    public avatar: string | null,
    public flags: Integer,
    public oauth2Tokens: OAuth2Tokens,
  ) {
    super(SocialPrimaryKey(`discord-${id}`), ESocialType.DISCORD);
  }

  public deriveKey(id: SnowflakeID): SocialPrimaryKey {
    return SocialPrimaryKey(`discord-${id}`);
  }

  public getVersion(): number {
    return DiscordProfile.CURRENT_VERSION;
  }
}

export interface DiscordProfileAPIResponse {
  id: SnowflakeID;
  username: Username;
  display_name: string | null;
  avatar: string | null;
  discriminator: string;
  flags: Integer;
}

export class DiscordProfileMigrator {
  public factory(data: Record<string, unknown>): DiscordProfile {
    return new DiscordProfile(
      SnowflakeID(data["id"] as string),
      Username(data["username"] as string),
      data["displayName"] as string,
      data["discriminator"] as string,
      data["avatar"] as string,
      Integer(data["flags"] as number),
      data["oauth2Tokens"] as OAuth2Tokens,
    );
  }
}
