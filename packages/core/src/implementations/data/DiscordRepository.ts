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
  SocialPrimaryKey,
} from "@snickerdoodlelabs/objects";
import { ERecordKey } from "@snickerdoodlelabs/persistence";
import { inject, injectable } from "inversify";
import { errAsync, ok, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoin } from "url-join-ts";

import { IDiscordRepository } from "@core/interfaces/data/IDiscordRepository";
import {
  IDataWalletPersistenceType,
  IDataWalletPersistence,
  ISocialRepositoryType,
  ISocialRepository,
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
              response.avatar ?? null,
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
                SnowflakeID("-1"), // not set yet
                profile.name,
                profile.owner,
                profile.permissions,
                profile.icon,
                null,
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
    return this.socialRepository.upsertProfile<DiscordProfile>(discordProfile);
  }

  public getUserProfiles(): ResultAsync<DiscordProfile[], PersistenceError> {
    return this.socialRepository.getProfiles<DiscordProfile>(
      ESocialType.DISCORD,
    );
  }

  public getProfileById(
    id: SnowflakeID,
  ): ResultAsync<DiscordProfile | null, PersistenceError> {
    const pKey = SocialPrimaryKey(`discord-${id}`); // Should be in a Utils class.
    return this.socialRepository.getProfileByPK<DiscordProfile>(pKey);
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
  public deleteProfile(id: SnowflakeID): ResultAsync<void, PersistenceError> {
    // 1. find the profile
    // 2. if exists delete the profile and all the guild profiles associated with it. We do not have cascading deletion. So, need to read and delete all the groups.
    return this.getProfileById(id).andThen((uProfile) => {
      if (uProfile == null) {
        // return okAsync(undefined);
        return errAsync(
          new PersistenceError(`Discord Profile #${id} does not exist`),
        );
      }
      return this.deleteUserData(uProfile);
    });
  }

  private deleteUserData(
    uProfile: DiscordProfile,
  ): ResultAsync<void, PersistenceError> {
    return this.socialRepository.deleteProfile(uProfile.pKey).andThen(() => {
      const ownerId = uProfile.pKey;
      const guildProfilesResult =
        this.socialRepository.getGroupProfilesByOwnerId<DiscordGuildProfile>(
          ownerId,
        );

      return guildProfilesResult.andThen((guildProfiles) => {
        const res = guildProfiles.map((guildProfile) => {
          return this.socialRepository.deleteGroupProfile(guildProfile.pKey);
        });
        return ResultUtils.combine(res).map(() => {});
      });
    });

    // return okAsync(undefined);
  }
  // public deleteGroupProfile(
  //   id: SnowflakeID,
  // ): ResultAsync<void, PersistenceError> {
  //   const pKey = SocialPrimaryKey(`discord-group-${id}`); // Should be in a Utils class.
  //   return okAsync(undefined);
  // }
}
