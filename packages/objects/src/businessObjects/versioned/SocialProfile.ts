import { OAuth2Tokens } from "@objects/businessObjects/OAuth2Tokens.js";
import { TokenAndSecret } from "@objects/businessObjects/TokenAndSecret.js";
import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/VersionedObject.js";
import { ESocialType } from "@objects/enum/index.js";
import {
  Integer,
  DiscordID,
  SocialPrimaryKey,
  Username,
  TwitterID,
} from "@objects/primitives/index.js";
import { PropertiesOf } from "@objects/utilities";

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

  protected factory(data: PropertiesOf<SocialProfile>): SocialProfile {
    switch (data.type) {
      case ESocialType.DISCORD:
        return this.discordMigrator.factory(
          data as PropertiesOf<DiscordProfile>,
        );
      case ESocialType.TWITTER:
        return this.twitterMigrator.factory(
          data as PropertiesOf<TwitterProfile>,
        );
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
    public id: DiscordID,
    public username: Username,
    public displayName: string | null,
    public discriminator: string,
    public avatar: string | null,
    public flags: Integer,
    public oauth2Tokens: OAuth2Tokens,
  ) {
    super(SocialPrimaryKey(`discord-${id}`), ESocialType.DISCORD);
  }

  public deriveKey(id: DiscordID): SocialPrimaryKey {
    return SocialPrimaryKey(`discord-${id}`);
  }
}

export class DiscordProfileMigrator {
  public factory(data: PropertiesOf<DiscordProfile>): DiscordProfile {
    return new DiscordProfile(
      data.id,
      data.username,
      data.displayName,
      data.discriminator,
      data.avatar,
      data.flags,
      new OAuth2Tokens(
        data.oauth2Tokens.accessToken,
        data.oauth2Tokens.refreshToken,
        data.oauth2Tokens.expiry,
      ),
    );
  }
}

export class TwitterUserObject {
  constructor(
    public id: TwitterID,
    public username: Username,
    public name?: string,
  ) {}
}

export class TwitterFollowData {
  constructor(
    public following: TwitterUserObject[],
    public followers: TwitterUserObject[],
  ) {}
}

export class TwitterProfile extends SocialProfile {
  public constructor(
    public userObject: TwitterUserObject,
    public oAuth1a: TokenAndSecret,
    public followData?: TwitterFollowData,
  ) {
    super(SocialPrimaryKey(`twitter-${userObject.id}`), ESocialType.TWITTER);
  }

  public deriveKey(id: TwitterID): SocialPrimaryKey {
    return SocialPrimaryKey(`twitter-${id}`);
  }
}

export class TwitterProfileMigrator {
  public factory(data: PropertiesOf<TwitterProfile>): TwitterProfile {
    return new TwitterProfile(
      new TwitterUserObject(
        data.userObject.id,
        data.userObject.username,
        data.userObject.name,
      ),
      data.oAuth1a,
      data.followData,
    );
  }
}
