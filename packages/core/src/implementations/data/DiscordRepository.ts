import {
  IAxiosAjaxUtilsType,
  IAxiosAjaxUtils,
  IRequestConfig,
} from "@snickerdoodlelabs/common-utils";
import {
  BearerAuthToken,
  DiscordProfile,
  DiscordError,
  DiscordGuildProfile,
  URLString,
  DiscordConfig,
  UnixTimestamp,
  DiscordProfileAPIResponse,
  DiscordGuildProfileAPIResponse,
  PersistenceError,
  EBackupPriority,
  VolatileStorageMetadata,
  ESocialType,
  SnowflakeID,
} from "@snickerdoodlelabs/objects";
import { ERecordKey } from "@snickerdoodlelabs/persistence";
import { inject, injectable } from "inversify";
import { errAsync, ok, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoin } from "url-join-ts";

import {
  IDataWalletPersistenceType,
  IDataWalletPersistence,
  ISocialRepositoryType,
  ISocialRepository,
} from "@core/interfaces/data/index.js";
import { IDiscordRepository } from "@core/interfaces/data/IDiscordRepository";
import {
  IConfigProvider,
  IConfigProviderType,
} from "@core/interfaces/utilities/IConfigProvider.js";

@injectable()
export class DiscordRepository implements IDiscordRepository {
  public constructor(
    @inject(IAxiosAjaxUtilsType) protected ajaxUtil: IAxiosAjaxUtils,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IDataWalletPersistenceType)
    protected persistence: IDataWalletPersistence,
    @inject(ISocialRepositoryType)
    protected socialRepository: ISocialRepository,
  ) {}

  protected getAPIConfig(): ResultAsync<DiscordConfig, DiscordError> {
    return this.configProvider.getConfig().andThen((config) => {
      if (!config.discord) {
        return errAsync(new DiscordError("Discord configuration not found!"));
      }
      return okAsync(config.discord);
    });
  }

  protected makeAPICall(apiUrl: URLString): ResultAsync<unknown, DiscordError> {
    return okAsync(undefined);
  }

  protected meUrl(): ResultAsync<URLString, DiscordError> {
    return this.getAPIConfig().andThen((apiConfig) => {
      return okAsync(URLString(urlJoin(apiConfig.dataAPIUrl, "/users/@me")));
    });
  }

  protected meGuildUrl(): ResultAsync<URLString, DiscordError> {
    return this.meUrl().andThen((meUrl) => {
      return okAsync(URLString(urlJoin(meUrl, "/guilds")));
    });
  }

  protected getRequestConfig(
    authToken: BearerAuthToken,
  ): ResultAsync<IRequestConfig, never> {
    const config: IRequestConfig = {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
        accept: "*/*",
      },
    };
    return okAsync(config);
  }

  public isAuthTokenValid(
    authToken: BearerAuthToken,
  ): ResultAsync<void, DiscordError> {
    throw new Error("Method not implemented.");
  }
  public refreshAuthToken(
    refreshToken: BearerAuthToken,
  ): ResultAsync<void, DiscordError> {
    throw new Error("Method not implemented.");
  }

  public fetchUserProfile(
    authToken: BearerAuthToken,
  ): ResultAsync<DiscordProfile, DiscordError> {
    return this.getRequestConfig(authToken).andThen((reqConfig) => {
      return this.meUrl().andThen((meUrl) => {
        return this.ajaxUtil
          .get<DiscordProfileAPIResponse>(new URL(meUrl), reqConfig)
          .andThen((response) => {
            const profile = new DiscordProfile(
              response.id,
              response.username,
              response.display_name,
              response.discriminator,
              response.avatar,
              response.flags,
              authToken,
              UnixTimestamp(0), // TODO fix the authExpiry
            );
            return okAsync(profile);
          })
          .orElse((error) => {
            return errAsync(new DiscordError(error.message));
          });
      });
    });
  }

  public fetchGuildProfiles(
    authToken: BearerAuthToken,
  ): ResultAsync<DiscordGuildProfile[], DiscordError> {
    return this.getRequestConfig(authToken).andThen((reqConfig) => {
      return this.meGuildUrl().andThen((meGuildUrl) => {
        return this.ajaxUtil
          .get<DiscordGuildProfileAPIResponse[]>(new URL(meGuildUrl), reqConfig)
          .andThen((response) => {
            const guildProfiles = response.map((profile) => {
              return new DiscordGuildProfile(
                profile.id,
                profile.name,
                profile.owner,
                profile.permissions,
                profile.icon,
                null,
                SnowflakeID("-1"),// not set yet
              );
            });

            return okAsync(guildProfiles);
          })
          .orElse((error) => {
            return errAsync(new DiscordError(error.message));
          });
      });
    });
  }

  public upsertUserProfile(
    discordProfile: DiscordProfile,
  ): ResultAsync<void, PersistenceError> {
    return this.socialRepository.upsertProfile(discordProfile);
  }

  public getUserProfiles(): ResultAsync<DiscordProfile[], PersistenceError> {
    return this.socialRepository.getProfiles(
      ESocialType.DISCORD,
    ) as ResultAsync<DiscordProfile[], PersistenceError>;
  }

  public upsertGuildProfiles(
    guildProfiles: DiscordGuildProfile[],
  ): ResultAsync<void, PersistenceError> {
    return this.socialRepository.upsertGroupProfiles(guildProfiles);
  }

  getGuildProfiles(): ResultAsync<DiscordGuildProfile[], PersistenceError> {
    return this.socialRepository.getGroupProfiles(
      ESocialType.DISCORD,
    ) as ResultAsync<DiscordGuildProfile[], PersistenceError>;
  }
}
