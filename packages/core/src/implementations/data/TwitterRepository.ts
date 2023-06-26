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
  IOauthUtils,
  IOAuthRepositoryType,
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
import { EHttpMethods } from "@core/interfaces/enums/index.js";

@injectable()
export class TwitterRepository implements ITwitterRepository {
  public constructor(
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(ISocialRepositoryType)
    protected socialRepository: ISocialRepository,
    @inject(IOAuthRepositoryType) protected oauthRepo: IOauthUtils,
  ) {}

  public getOAuth1RequestToken(): ResultAsync<TokenAndSecret, TwitterError> {
    return this._getAPIConfig().andThen((config) => {
      return this.oauthRepo
        .getOauth1RequestToken(
          URLString(urlJoin(config.oAuthBaseUrl, "/request_token")),
          config,
          EHttpMethods.POST
        )
        .mapErr((e) => {
          return new TwitterError(e.message, e);
        });
    });
  }

  public initTwitterProfile(
    requestToken: OAuth1RequstToken,
    oAuthVerifier: OAuthVerifier,
  ): ResultAsync<TwitterProfile, TwitterError | PersistenceError> {
    return this._getAPIConfig().andThen((config) => {
      return this.oauthRepo
        .getOauth1AccessTokenSearchParams(
          URLString(urlJoin(config.oAuthBaseUrl, "/access_token")),
          config,
          EHttpMethods.POST,
          requestToken,
          oAuthVerifier,
        )
        .mapErr((error) => {
          return new TwitterError(error.message, error);
        })
        .andThen((response) => {
          if (!this._isAccessTokenResponseValid(response)) {
            return errAsync(
              new TwitterError(
                `Received corrupted access token object: ${response}`,
              ),
            );
          }

          return okAsync(
            new TwitterProfile(
              {
                id: TwitterID(response.get("user_id")!),
                username: Username(response.get("screen_name")!),
              },
              new TokenAndSecret(
                BearerToken(response.get("oauth_token")!),
                TokenSecret(response.get("oauth_token_secret")!),
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
      return this.socialRepository.deleteProfile(profile.primaryKey);
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
    return this.oauthRepo
      .makeAPICallWithOAuth1<{ data: TwitterUserObject }>(
        url,
        EHttpMethods.GET,
        config,
        oAuth1Access,
      )
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

    return this.oauthRepo
      .makeAPICallWithOAuth1<{
        data: TwitterUserObject[];
        meta: { result_count: number; next_token: string };
      }>(url,  EHttpMethods.GET, config, oAuth1Access, pathParams)
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
    return this.oauthRepo
      .makeAPICallWithOAuth1<{
        data: TwitterUserObject[];
        meta: { result_count: number; next_token: string };
      }>(url,  EHttpMethods.GET, config, oAuth1Access, pathParams)
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

  private _isAccessTokenResponseValid(responseObj: URLSearchParams): boolean {
    return (
      responseObj.get("screen_name") != null &&
      responseObj.get("user_id") != null
    );
  }
}
