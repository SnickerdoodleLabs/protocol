import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  IRequestConfig,
  ITimeUtils,
  ITimeUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  OAuth2AccessToken,
  DiscordConfig,
  DiscordError,
  DiscordGuildProfile,
  DiscordGuildProfileAPIResponse,
  DiscordProfile,
  OAuth2RefreshToken,
  ESocialType,
  OAuth2Tokens,
  OAuthAuthorizationCode,
  PersistenceError,
  DiscordID,
  SocialPrimaryKey,
  UnixTimestamp,
  URLString,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoin } from "url-join-ts";

import {
  DiscordOAuth2TokensAPIResponse,
  DiscordProfileAPIResponse,
} from "@core/interfaces/data/apis";
import { IDiscordRepository } from "@core/interfaces/data/IDiscordRepository";
import {
  ISocialRepository,
  ISocialRepositoryType,
} from "@core/interfaces/data/index.js";
import {
  IConfigProvider,
  IConfigProviderType,
} from "@core/interfaces/utilities/IConfigProvider.js";

@injectable()
export class DiscordRepository implements IDiscordRepository {
  public constructor(
    @inject(IAxiosAjaxUtilsType) protected ajaxUtil: IAxiosAjaxUtils,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(ISocialRepositoryType)
    protected socialRepository: ISocialRepository,
    @inject(ITimeUtilsType)
    protected timeUtils: ITimeUtils,
  ) {}

  public isAuthTokenValid(
    oAuth2Tokens: OAuth2Tokens,
  ): ResultAsync<boolean, never> {
    return okAsync(this.timeUtils.getUnixNow() < oAuth2Tokens.expiry);
  }

  public refreshAuthToken(
    refreshToken: OAuth2RefreshToken,
  ): ResultAsync<OAuth2Tokens, DiscordError> {
    return ResultUtils.combine([
      this.tokenAPICallBaseConfig(),
      this.tokenUrl(),
    ]).andThen(([tokenBaseConfig, tokenUrl]) => {
      return this.ajaxUtil
        .post<DiscordOAuth2TokensAPIResponse>(new URL(tokenUrl), {
          ...tokenBaseConfig,
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        })
        .map(this.factoryAccessToken)
        .mapErr((error) => {
          return new DiscordError(error.message);
        });
    });
  }

  public getAccessToken(
    code: OAuthAuthorizationCode,
  ): ResultAsync<OAuth2Tokens, DiscordError> {
    return ResultUtils.combine([
      this.tokenAPICallBaseConfig(),
      this.tokenUrl(),
    ]).andThen(([tokenBaseConfig, tokenUrl]) => {
      return this.ajaxUtil
        .post<DiscordOAuth2TokensAPIResponse>(
          new URL(tokenUrl),
          new URLSearchParams({
            ...tokenBaseConfig,
            grant_type: "authorization_code",
            code: code,
            scope: "identify guilds",
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
              accept: "*/*",
            },
          } as IRequestConfig,
        )
        .andThen((response) => {
          return okAsync(this.factoryAccessToken(response));
        })
        .orElse((error) => {
          return errAsync(new DiscordError(error.message, error.src));
        });
    });
  }

  public fetchUserProfile(
    oauth2Tokens: OAuth2Tokens,
  ): ResultAsync<DiscordProfile, DiscordError> {
    return this.meUrl().andThen((meUrl) => {
      return this.ajaxUtil
        .get<DiscordProfileAPIResponse>(
          new URL(meUrl),
          this.getRequestConfig(oauth2Tokens.accessToken),
        )
        .map(
          (response) =>
            new DiscordProfile(
              response.id,
              response.username,
              response.display_name,
              response.discriminator,
              response.avatar ?? null,
              response.flags,
              oauth2Tokens,
            ),
        )
        .mapErr((error) => {
          return new DiscordError(error.message);
        });
    });
  }

  public fetchGuildProfiles(
    oauth2Tokens: OAuth2Tokens,
  ): ResultAsync<DiscordGuildProfile[], DiscordError> {
    return this.meGuildUrl().andThen((meGuildUrl) => {
      return this.ajaxUtil
        .get<DiscordGuildProfileAPIResponse[]>(
          new URL(meGuildUrl),
          this.getRequestConfig(oauth2Tokens.accessToken),
        )
        .map((response) =>
          response.map((profile) => {
            return new DiscordGuildProfile(
              profile.id,
              undefined,
              profile.name,
              profile.owner,
              profile.permissions,
              profile.icon,
              null,
            );
          }),
        )
        .mapErr((error) => {
          return new DiscordError(error.message);
        });
    });
  }

  public upsertUserProfile(
    discordProfile: DiscordProfile,
  ): ResultAsync<void, PersistenceError> {
    return this.socialRepository.upsertProfile<DiscordProfile>(discordProfile);
  }

  public getUserProfiles(): ResultAsync<DiscordProfile[], PersistenceError> {
    return this.socialRepository.getProfiles<DiscordProfile>(
      ESocialType.DISCORD,
    );
  }

  public getProfileById(
    id: DiscordID,
  ): ResultAsync<DiscordProfile | null, PersistenceError> {
    const primaryKey = SocialPrimaryKey(`discord-${id}`); // Should be in a Utils class.
    return this.socialRepository.getProfileByPK<DiscordProfile>(primaryKey);
  }

  public upsertGuildProfiles(
    guildProfiles: DiscordGuildProfile[],
  ): ResultAsync<void, PersistenceError> {
    return this.socialRepository.upsertGroupProfiles<DiscordGuildProfile>(
      guildProfiles,
    );
  }

  public getGuildProfiles(): ResultAsync<
    DiscordGuildProfile[],
    PersistenceError
  > {
    return this.socialRepository.getGroupProfiles<DiscordGuildProfile>(
      ESocialType.DISCORD,
    );
  }

  public deleteProfile(id: DiscordID): ResultAsync<void, PersistenceError> {
    // 1. find the profile
    // 2. if exists delete the profile and all the guild profiles associated with it. We do not have cascading deletion. So, need to read and delete all the groups.
    return this.getProfileById(id).andThen((uProfile) => {
      if (uProfile == null) {
        return errAsync(
          new PersistenceError(`Discord Profile #${id} does not exist`),
        );
      }
      return this.deleteUserData(uProfile);
    });
  }

  protected getAPIConfig(): ResultAsync<DiscordConfig, DiscordError> {
    return this.configProvider.getConfig().andThen((config) => {
      if (!config.discord) {
        return errAsync(new DiscordError("Discord configuration not found!"));
      }
      return okAsync(config.discord);
    });
  }

  protected tokenUrl(): ResultAsync<URLString, DiscordError> {
    return this.getAPIConfig().map((apiConfig) =>
      URLString(urlJoin(apiConfig.dataAPIUrl, "/oauth2/token")),
    );
  }

  protected meUrl(): ResultAsync<URLString, DiscordError> {
    return this.getAPIConfig().map((apiConfig) =>
      URLString(urlJoin(apiConfig.dataAPIUrl, "/users/@me")),
    );
  }

  protected meGuildUrl(): ResultAsync<URLString, DiscordError> {
    return this.meUrl().map((meUrl) => URLString(urlJoin(meUrl, "/guilds")));
  }

  protected tokenAPICallBaseConfig() {
    return this.getAPIConfig().map((apiConfig) => {
      return {
        client_id: apiConfig.clientId,
        client_secret: apiConfig.clientSecret,
        redirect_uri: apiConfig.oauthRedirectUrl,
      };
    });
  }

  protected factoryAccessToken(apiResponse: DiscordOAuth2TokensAPIResponse) {
    return new OAuth2Tokens(
      apiResponse.access_token,
      apiResponse.refresh_token,
      UnixTimestamp(
        Number(this.timeUtils.getUnixNow()) + apiResponse.expires_in,
      ),
    );
  }

  protected getRequestConfig(authToken: OAuth2AccessToken): IRequestConfig {
    return {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
        accept: "*/*",
      },
    };
  }

  private deleteUserData(
    uProfile: DiscordProfile,
  ): ResultAsync<void, PersistenceError> {
    return this.socialRepository
      .deleteProfile(uProfile.primaryKey)
      .andThen(() => {
        return this.socialRepository.getGroupProfilesByOwnerId<DiscordGuildProfile>(
          uProfile.primaryKey,
        );
      })
      .andThen((guildProfiles) => {
        return ResultUtils.combine(
          guildProfiles.map((guildProfile) => {
            return this.socialRepository.deleteGroupProfile(guildProfile.primaryKey);
          }),
        );
      })
      .map(() => {});
  }
}
