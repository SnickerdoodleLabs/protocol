import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ICryptoUtils,
  ICryptoUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  BearerToken,
  ESocialType,
  OAuth1RequstToken,
  OAuthVerifier,
  PersistenceError,
  SocialPrimaryKey,
  TokenAndSecret,
  TokenSecret,
  TwitterConfig,
  TwitterError,
  TwitterFollowData,
  TwitterID,
  TwitterProfile,
  TwitterUserObject,
  URLString,
  Username,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync, errAsync, okAsync } from "neverthrow";

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
import { urlJoin } from "url-join-ts";

@injectable()
export class TwitterRepository implements ITwitterRepository {
  public constructor(
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtil: IAxiosAjaxUtils,
    @inject(ISocialRepositoryType)
    protected socialRepository: ISocialRepository,
    @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
  ) {}

  public getOAuth1RequestToken(): ResultAsync<TokenAndSecret, TwitterError> {
    return this._getAPIConfig().andThen((config) => {
      const urlString = URLString(
        urlJoin(config.oAuthBaseUrl, "/request_token"),
      );
      return this.ajaxUtil
        .post<string>(new URL(urlString), undefined, {
          headers: {
            authorization: this.cryptoUtils.packOAuth1Credentials(
              config,
              urlString,
              "POST",
              {
                oauth_callback: config.oAuthCallbackUrl,
              },
            ),
          },
        })
        .mapErr((error) => {
          return new TwitterError(error.message, error);
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
              BearerToken(queryParams.get("oauth_token")!),
              TokenSecret(queryParams.get("oauth_token_secret")!),
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
      const urlString = URLString(
        urlJoin(config.oAuthBaseUrl, "/access_token"),
      );
      const pathParams = {
        oauth_token: requestToken,
        oauth_verifier: oAuthVerifier,
      };
      return this.ajaxUtil
        .post<string>(new URL(urlString), undefined, {
          params: pathParams,
          headers: {
            authorization: this.cryptoUtils.packOAuth1Credentials(
              config,
              urlString,
              "POST",
              pathParams,
            ),
          },
        })
        .mapErr((error) => {
          return new TwitterError(error.message, error);
        })
        .andThen((resposeStr) => {
          const queryParams = new URLSearchParams(resposeStr);
          if (!this._isAccessTokenResponseValid(queryParams)) {
            return errAsync(
              new TwitterError(
                `Received corrupted access token object: ${queryParams}`,
              ),
            );
          }

          return okAsync(
            new TwitterProfile(
              {
                id: TwitterID(queryParams.get("user_id")!),
                username: Username(queryParams.get("screen_name")!),
              },
              new TokenAndSecret(
                BearerToken(queryParams.get("oauth_token")!),
                TokenSecret(queryParams.get("oauth_token_secret")!),
              ),
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
      if (!profile) {
        return errAsync(
          new PersistenceError(
            `Cannot delete profile #${id} because it doesn't exist in persistence.`,
          ),
        );
      }
      return this.socialRepository.deleteProfile(profile.pKey);
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
    const url = URLString(urlJoin(config.dataAPIUrl, `/users/${userId}`));
    return this.ajaxUtil
      .get<{ data: TwitterUserObject }>(new URL(url), {
        headers: {
          authorization: this.cryptoUtils.packOAuth1Credentials(
            config,
            url,
            "GET",
            undefined,
            oAuth1Access,
          ),
        },
      })
      .mapErr((error) => {
        return new TwitterError(error.message, error);
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
    const url = URLString(
      urlJoin(config.dataAPIUrl, `/users/${userId}/followers`),
    );
    const pathParams = {
      max_results: 1000,
      ...(nextPageToken ? { pagination_token: nextPageToken } : {}),
    };
    return this.ajaxUtil
      .get<{
        data: TwitterUserObject[];
        meta: { result_count: number; next_token: string };
      }>(new URL(url), {
        params: pathParams,
        headers: {
          authorization: this.cryptoUtils.packOAuth1Credentials(
            config,
            url,
            "GET",
            pathParams,
            oAuth1Access,
          ),
        },
      })
      .mapErr((error) => {
        return new TwitterError(error.message, error);
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
    oAuth1Access: TokenAndSecret,
    nextPageToken?: string,
    recursionCount: number = 1,
  ): ResultAsync<TwitterUserObject[], TwitterError> {
    const url = URLString(
      urlJoin(config.dataAPIUrl, `/users/${userId}/following`),
    );
    const pathParams = {
      max_results: 1000,
      ...(nextPageToken ? { pagination_token: nextPageToken } : {}),
    };
    return this.ajaxUtil
      .get<{
        data: TwitterUserObject[];
        meta: { result_count: number; next_token: string };
      }>(new URL(url), {
        params: pathParams,
        headers: {
          authorization: this.cryptoUtils.packOAuth1Credentials(
            config,
            url,
            "GET",
            pathParams,
            oAuth1Access,
          ),
        },
      })
      .mapErr((error) => {
        return new TwitterError(error.message, error);
      })
      .andThen((responseObj) => {
        if (!responseObj.data || recursionCount > 100) {
          return okAsync([]);
        }
        if (responseObj.meta.next_token) {
          return this._fetchFollowing(
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
        return errAsync(
          new TwitterError(
            "Twitter configuration is null. Cannot retrieve API config.",
          ),
        );
      }
      return okAsync(config.twitter);
    });
  }
}
