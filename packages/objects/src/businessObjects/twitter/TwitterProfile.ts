import { ITokenAndSecret } from "@objects/businessObjects/index.js";
import { SocialProfile } from "@objects/businessObjects/SocialProfile.js";
import { ESocialType } from "@objects/enum/index.js";
import {
  SnowflakeID,
  SocialPrimaryKey,
  Username,
} from "@objects/primitives/index.js";

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
