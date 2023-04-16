import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  BearerAuthToken,
  ESocialType,
  ITokenAndSecret,
  ITwitterUserObject,
  PersistenceError,
  SnowflakeID,
  SocialPrimaryKey,
  TokenSecret,
  TwitterConfig,
  TwitterError,
  TwitterProfile,
  URLString,
  Username,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import {
  ISocialRepository,
  ISocialRepositoryType,
  ITwitterRepository,
} from "@core/interfaces/data/index.js";
import { ResultUtils } from "neverthrow-result-utils";

@injectable()
export class TwitterRepository implements ITwitterRepository {
  public constructor(
    @inject(IAxiosAjaxUtilsType) protected ajaxUtil: IAxiosAjaxUtils,
    @inject(ISocialRepositoryType)
    protected socialRepository: ISocialRepository,
  ) {}

  public getOAuth1aRequestToken(
    config: TwitterConfig,
  ): ResultAsync<ITokenAndSecret, TwitterError> {
    const urlString = config.oAuthBaseUrl + "/request_token";
    const pathParams = {
      oauth_callback: encodeURIComponent(config.oAuthCallbackUrl),
    };
    return this.ajaxUtil
      .post<string>(new URL(urlString), undefined, {
        params: pathParams,
        headers: {
          authorization: config.getOAuth1aHeader({
            url: urlString,
            method: "POST",
            data: pathParams,
          }),
        },
      })
      .mapErr((error) => new TwitterError(error.message))
      .map(this._parseResponseString)
      .map((responseObj) => {
        return {
          token: responseObj["oauth_token"],
          secret: responseObj["oauth_token_secret"],
        } as ITokenAndSecret;
      });
  }

  public initTwitterProfile(
    config: TwitterConfig,
    requestToken: BearerAuthToken,
    oAuthVerifier: string,
  ): ResultAsync<TwitterProfile, TwitterError | PersistenceError> {
    const urlString = config.oAuthBaseUrl + "/access_token";
    const pathParams = {
      oauth_token: requestToken,
      oauth_verifier: oAuthVerifier,
    };
    return this.ajaxUtil
      .post<string>(new URL(urlString), undefined, {
        params: pathParams,
        headers: {
          authorization: config.getOAuth1aHeader({
            url: urlString,
            method: "POST",
            data: pathParams,
          }),
        },
      })
      .mapErr((error) => new TwitterError(error.message))
      .andThen((resposeStr) => {
        const responseObj = this._parseResponseString(resposeStr);
        if (this._isAccessTokenResponseValid(responseObj)) {
          return okAsync(
            new TwitterProfile(
              {
                id: SnowflakeID(responseObj["user_id"]),
                username: Username(responseObj["screen_name"]),
              },
              {
                token: BearerAuthToken(responseObj["oauth_token"]),
                secret: TokenSecret(responseObj["oauth_token_secret"]),
              },
            ),
          );
        }
        return errAsync(
          new TwitterError(
            `Received corrupted access token object: ${responseObj}`,
          ),
        );
      })
      .andThen((profile) => this.populateProfile(config, profile));
  }

  public populateProfile(
    config: TwitterConfig,
    profile: TwitterProfile,
  ): ResultAsync<TwitterProfile, TwitterError | PersistenceError> {
    return ResultUtils.combine([
      this._fetchUserProfile(config, profile.userObject.id, profile.oAuth1a),
      this._fetchFollowing(config, profile.userObject.id, profile.oAuth1a),
      this._fetchFollowers(config, profile.userObject.id, profile.oAuth1a),
    ])
      .map(([userProfile, following, followers]) => {
        profile.userObject = userProfile;
        profile.followData = { following: following, followers: followers };
        return profile;
      })
      .andThen((profile) => this.upsertUserProfile(profile).map(() => profile));
  }

  public upsertUserProfile(
    twitterProfile: TwitterProfile,
  ): ResultAsync<void, PersistenceError> {
    return this.socialRepository.upsertProfile<TwitterProfile>(twitterProfile);
  }

  public getUserProfiles(): ResultAsync<TwitterProfile[], PersistenceError> {
    return this.socialRepository.getProfiles<TwitterProfile>(
      ESocialType.TWITTER,
    );
  }

  public deleteProfile(id: SnowflakeID): ResultAsync<void, PersistenceError> {
    return this.getProfileById(id).andThen((profile) => {
      if (profile) {
        return this.socialRepository.deleteProfile(profile.pKey);
      }
      return errAsync(
        new PersistenceError(
          `Cannot delete profile #${id} because it doesn't exist in persistence.`,
        ),
      );
    });
  }

  public getProfileById(
    id: SnowflakeID,
  ): ResultAsync<TwitterProfile | null, PersistenceError> {
    return this.socialRepository.getProfileByPK<TwitterProfile>(
      SocialPrimaryKey(`twitter-${id}`),
    );
  }

  private _fetchUserProfile(
    config: TwitterConfig,
    userId: SnowflakeID,
    oAuth1a: ITokenAndSecret,
  ): ResultAsync<ITwitterUserObject, TwitterError> {
    const url = URLString(config.dataAPIUrl + `/users/${userId}`);
    return this.ajaxUtil
      .get<{ data: ITwitterUserObject }>(new URL(url), {
        headers: {
          authorization: config.getOAuth1aHeader(
            {
              url: url,
              method: "GET",
            },
            oAuth1a,
          ),
        },
      })
      .mapErr((error) => new TwitterError(error.message))
      .map((responseObj) => responseObj.data);
  }

  private _fetchFollowers(
    config: TwitterConfig,
    userId: SnowflakeID,
    oAuth1a: ITokenAndSecret,
  ): ResultAsync<ITwitterUserObject[], TwitterError> {
    const url = URLString(config.dataAPIUrl + `/users/${userId}/followers`);
    return this.ajaxUtil
      .get<{ data: ITwitterUserObject[] }>(new URL(url), {
        headers: {
          authorization: config.getOAuth1aHeader(
            {
              url: url,
              method: "GET",
            },
            oAuth1a,
          ),
        },
      })
      .mapErr((error) => new TwitterError(error.message))
      .map((responseObj) => (responseObj.data as ITwitterUserObject[]) ?? []);
  }

  private _fetchFollowing(
    config: TwitterConfig,
    userId: SnowflakeID,
    oAuth1a: ITokenAndSecret,
  ): ResultAsync<ITwitterUserObject[], TwitterError> {
    const url = URLString(config.dataAPIUrl + `/users/${userId}/following`);
    return this.ajaxUtil
      .get<{ data: ITwitterUserObject[] }>(new URL(url), {
        headers: {
          authorization: config.getOAuth1aHeader(
            {
              url: url,
              method: "GET",
            },
            oAuth1a,
          ),
        },
      })
      .mapErr((error) => new TwitterError(error.message))
      .map((responseObj) => (responseObj.data as ITwitterUserObject[]) ?? []);
  }

  private _parseResponseString(res: string): object {
    return Object.fromEntries(
      res.split("&").map((paramPair) => [...paramPair.split("=")]),
    );
  }

  private _isAccessTokenResponseValid(responseObj: object): boolean {
    return (
      responseObj["oauth_token"] &&
      responseObj["oauth_token_secret"] &&
      responseObj["screen_name"] &&
      responseObj["user_id"]
    );
  }
}
