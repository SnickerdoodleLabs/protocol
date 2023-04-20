import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  BearerToken,
  ESocialType,
  TwitterUserObject,
  OAuth1RequstToken,
  OAuthVerifier,
  PersistenceError,
  SocialPrimaryKey,
  TokenAndSecret,
  TokenSecret,
  TwitterConfig,
  TwitterError,
  TwitterID,
  TwitterProfile,
  URLString,
  Username,
  TwitterFollowData,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import {
  IOAuthUtils,
  IOAuthUtilsType,
} from "@core/interfaces/business/utilities/index.js";
import {
  ISocialRepository,
  ISocialRepositoryType,
  ITwitterRepository,
} from "@core/interfaces/data/index.js";
import {
  IConfigProvider,
  IConfigProviderType,
} from "@core/interfaces/utilities/index.js";
import { ResultUtils } from "neverthrow-result-utils";

@injectable()
export class TwitterRepository implements ITwitterRepository {
  public constructor(
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtil: IAxiosAjaxUtils,
    @inject(ISocialRepositoryType)
    protected socialRepository: ISocialRepository,
    @inject(IOAuthUtilsType) protected oAuthUtils: IOAuthUtils,
  ) {}

  public getOAuth1aRequestToken(): ResultAsync<TokenAndSecret, TwitterError> {
    return this._getAPIConfig().andThen((config) => {
      const urlString = config.oAuthBaseUrl + "/request_token";
      const pathParams = {
        oauth_callback: encodeURIComponent(config.oAuthCallbackUrl),
      };
      return this.ajaxUtil
        .post<string>(new URL(urlString), undefined, {
          params: pathParams,
          headers: {
            authorization: this.oAuthUtils.getOAuth1aString(
              {
                url: urlString,
                method: "POST",
                data: pathParams,
              },
              config.oauth,
            ),
          },
        })
        .mapErr((error) => {
          return new TwitterError(error.message);
        })
        .andThen((responseStr) => {
          const queryParams = new URLSearchParams(responseStr);
          if (!this._responseHasOAuthToken(queryParams)) {
            return errAsync(
              new TwitterError(
                `Requested a "request token" but the response does not include a valid oAuth token`,
              ),
            );
          }

          return okAsync(
            new TokenAndSecret(
              queryParams.get("oauth_token")! as BearerToken,
              queryParams.get("oauth_token_secret")! as TokenSecret,
            ),
          );
        });
    });
  }

  public initTwitterProfile(
    requestToken: OAuth1RequstToken,
    oAuthVerifier: OAuthVerifier,
  ): ResultAsync<TwitterProfile, TwitterError | PersistenceError> {
    return this._getAPIConfig().andThen((config) => {
      const urlString = config.oAuthBaseUrl + "/access_token";
      const pathParams = {
        oauth_token: requestToken,
        oauth_verifier: oAuthVerifier,
      };
      return this.ajaxUtil
        .post<string>(new URL(urlString), undefined, {
          params: pathParams,
          headers: {
            authorization: this.oAuthUtils.getOAuth1aString(
              {
                url: urlString,
                method: "POST",
                data: pathParams,
              },
              config.oauth,
            ),
          },
        })
        .mapErr((error) => {
          return new TwitterError(error.message);
        })
        .andThen((resposeStr) => {
          const queryParams = new URLSearchParams(resposeStr);
          if (this._isAccessTokenResponseValid(queryParams)) {
            return okAsync(
              new TwitterProfile(
                {
                  id: TwitterID(queryParams.get("user_id")!),
                  username: Username(queryParams.get("screen_name")!),
                },
                new TokenAndSecret(
                  queryParams.get("oauth_token")! as BearerToken,
                  queryParams.get("oauth_token_secret")! as TokenSecret,
                ),
              ),
            );
          }
          return errAsync(
            new TwitterError(
              `Received corrupted access token object: ${queryParams}`,
            ),
          );
        })
        .andThen((profile) => {
          return this.populateProfile([profile], config).map(
            ([profile]) => profile,
          );
        });
    });
  }

  public populateProfile(
    profiles: TwitterProfile[],
    config?: TwitterConfig,
  ): ResultAsync<TwitterProfile[], TwitterError | PersistenceError> {
    return ResultAsync.fromPromise(
      new Promise<TwitterConfig>((resolve) => {
        if (config != null) {
          resolve(config);
        }
        this._getAPIConfig().map(resolve);
      }),
      (e) =>
        new TwitterError(
          "TwitterRepository.populateProfile can't retrieve config",
          e,
        ),
    ).andThen((config) => {
      return ResultUtils.combine(
        profiles.map((p) => {
          return ResultUtils.combine([
            this._fetchUserProfile(config, p.userObject.id, p.oAuth1a),
            this._fetchFollowing(config, p.userObject.id, p.oAuth1a),
            this._fetchFollowers(config, p.userObject.id, p.oAuth1a),
          ]).andThen(([userProfile, following, followers]) => {
            p.userObject = userProfile;
            p.followData = new TwitterFollowData(following, followers);
            return this.upsertUserProfile(p).map(() => p);
          });
        }),
      );
    });
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

  public deleteProfile(id: TwitterID): ResultAsync<void, PersistenceError> {
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
    id: TwitterID,
  ): ResultAsync<TwitterProfile | null, PersistenceError> {
    return this.socialRepository.getProfileByPK<TwitterProfile>(
      SocialPrimaryKey(`twitter-${id}`),
    );
  }

  private _fetchUserProfile(
    config: TwitterConfig,
    userId: TwitterID,
    oAuth1Access: TokenAndSecret,
  ): ResultAsync<TwitterUserObject, TwitterError> {
    const url = URLString(config.dataAPIUrl + `/users/${userId}`);
    return this.ajaxUtil
      .get<{ data: TwitterUserObject }>(new URL(url), {
        headers: {
          authorization: this.oAuthUtils.getOAuth1aString(
            {
              url: url,
              method: "GET",
            },
            config.oauth,
            oAuth1Access,
          ),
        },
      })
      .mapErr((error) => {
        return new TwitterError(error.message);
      })
      .map((responseObj) => responseObj.data);
  }

  private _fetchFollowers(
    config: TwitterConfig,
    userId: TwitterID,
    oAuth1Access: TokenAndSecret,
    nextPageToken?: string,
    recursionCount: number = 1,
  ): ResultAsync<TwitterUserObject[], TwitterError> {
    const url = URLString(config.dataAPIUrl + `/users/${userId}/followers`);
    const pathParams = {
      max_results: 1000,
    };
    if (nextPageToken) {
      pathParams["pagination_token"] = nextPageToken;
    }
    return this.ajaxUtil
      .get<{
        data: TwitterUserObject[];
        meta: { result_count: number; next_token: string };
      }>(new URL(url), {
        params: pathParams,
        headers: {
          authorization: this.oAuthUtils.getOAuth1aString(
            {
              url: url,
              method: "GET",
              data: pathParams,
            },
            config.oauth,
            oAuth1Access,
          ),
        },
      })
      .mapErr((error) => {
        return new TwitterError(error.message);
      })
      .andThen((responseObj) => {
        if (!responseObj.data || recursionCount > 100) {
          return okAsync([]);
        }
        if (responseObj.meta.next_token) {
          return this._fetchFollowers(
            config,
            userId,
            oAuth1Access,
            responseObj.meta.next_token,
            recursionCount + 1,
          ).map((rest) => [...responseObj.data, ...rest]);
        }
        return okAsync(responseObj.data);
      });
  }

  private _fetchFollowing(
    config: TwitterConfig,
    userId: TwitterID,
    oAuth1aAccess: TokenAndSecret,
    nextPageToken?: string,
    recursionCount: number = 1,
  ): ResultAsync<TwitterUserObject[], TwitterError> {
    const url = URLString(config.dataAPIUrl + `/users/${userId}/following`);
    const pathParams = {
      max_results: 1000,
    };
    if (nextPageToken) {
      pathParams["pagination_token"] = nextPageToken;
    }
    return this.ajaxUtil
      .get<{
        data: TwitterUserObject[];
        meta: { result_count: number; next_token: string };
      }>(new URL(url), {
        params: pathParams,
        headers: {
          authorization: this.oAuthUtils.getOAuth1aString(
            {
              url: url,
              method: "GET",
              data: pathParams,
            },
            config.oauth,
            oAuth1aAccess,
          ),
        },
      })
      .mapErr((error) => {
        return new TwitterError(error.message);
      })
      .andThen((responseObj) => {
        if (!responseObj.data || recursionCount > 100) {
          return okAsync([]);
        }
        if (responseObj.meta.next_token) {
          return this._fetchFollowing(
            config,
            userId,
            oAuth1aAccess,
            responseObj.meta.next_token,
            recursionCount + 1,
          ).map((rest) => [...responseObj.data, ...rest]);
        }
        return okAsync(responseObj.data);
      });
  }

  private _isAccessTokenResponseValid(responseObj: URLSearchParams): boolean {
    return (
      this._responseHasOAuthToken(responseObj) &&
      responseObj.get("screen_name") != null &&
      responseObj.get("user_id") != null
    );
  }

  private _responseHasOAuthToken(responseObj: URLSearchParams): boolean {
    return (
      responseObj.get("oauth_token") != null &&
      responseObj.get("oauth_token_secret") != null
    );
  }

  private _getAPIConfig(): ResultAsync<TwitterConfig, TwitterError> {
    return this.configProvider.getConfig().andThen((config) => {
      if (config.twitter == null) {
        return errAsync(new TwitterError("Twitter configuration is NULL!"));
      }
      return okAsync(config.twitter);
    });
  }
}
