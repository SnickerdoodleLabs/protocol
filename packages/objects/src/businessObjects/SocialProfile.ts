import {
  ITokenAndSecret,
  OAuth2Tokens,
} from "@objects/businessObjects/index.js";
import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/VersionedObject.js";
import { ESocialType } from "@objects/enum/index.js";
import {
  Integer,
  SnowflakeID,
  SocialPrimaryKey,
  Username,
} from "@objects/primitives/index.js";

export abstract class SocialProfile extends VersionedObject {
  public static CURRENT_VERSION = 1;
  public constructor(public pKey: SocialPrimaryKey, public type: ESocialType) {
    super();
  }
  public getVersion(): number {
    return SocialProfile.CURRENT_VERSION;
  }
}

export class InvalidSocialProfile extends SocialProfile {
  public static CURRENT_VERSION = 1;
  public constructor(public pKey: SocialPrimaryKey, public type: ESocialType) {
    super(pKey, type);
  }
  public getVersion(): number {
    return InvalidSocialProfile.CURRENT_VERSION;
  }
}

export class SocialProfileMigrator extends VersionedObjectMigrator<SocialProfile> {
  public getCurrentVersion(): number {
    return SocialProfile.CURRENT_VERSION;
  }

  protected discordMigrator: DiscordProfileMigrator;
  protected twitterMigrator: TwitterProfileMigrator;

  public constructor() {
    super();
    this.discordMigrator = new DiscordProfileMigrator();
    this.twitterMigrator = new TwitterProfileMigrator();
  }

  protected factory(data: Record<string, unknown>): SocialProfile {
    switch (data["type"]) {
      case ESocialType.DISCORD:
        return this.discordMigrator.factory(data);
      case ESocialType.TWITTER:
        return this.twitterMigrator.factory(data);
    }
    return new InvalidSocialProfile( // Cannot return null
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

export class DiscordProfile extends SocialProfile {
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

export interface ITwitterUserObject {
  id: SnowflakeID;
  username: Username;
  name?: string;
}

export interface ITwitterFollowData {
  following: ITwitterUserObject[];
  followers: ITwitterUserObject[];
}

export class TwitterProfile extends SocialProfile {
  public constructor(
    public userObject: ITwitterUserObject,
    public oAuth1a: ITokenAndSecret,
    public followData?: ITwitterFollowData,
  ) {
    super(SocialPrimaryKey(`twitter-${userObject.id}`), ESocialType.TWITTER);
  }

  public deriveKey(id: SnowflakeID): SocialPrimaryKey {
    return SocialPrimaryKey(`twitter-${id}`);
  }
}

export class TwitterProfileMigrator {
  public factory(data: Record<string, unknown>): TwitterProfile {
    return new TwitterProfile(
      data["userObject"] as ITwitterUserObject,
      data["oAuth1a"] as ITokenAndSecret,
      data["followData"]
        ? (data["followData"] as ITwitterFollowData)
        : undefined,
    );
  }
}
