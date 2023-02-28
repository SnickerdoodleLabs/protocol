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
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, ok, okAsync, ResultAsync } from "neverthrow";
import { urlJoin } from "url-join-ts";

import {
  IDataWalletPersistenceType,
  IDataWalletPersistence,
} from "@core/interfaces/data";
import { IDiscordRepository } from "@core/interfaces/data/IDiscordRepository";
import {
  IConfigProvider,
  IConfigProviderType,
} from "@core/interfaces/utilities/IConfigProvider";
import { ERecordKey } from "@snickerdoodlelabs/persistence";

@injectable()
class DiscordRepository implements IDiscordRepository {
  public constructor(
    @inject(IAxiosAjaxUtilsType) protected ajaxUtil: IAxiosAjaxUtils,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IDataWalletPersistenceType)
    protected persistence: IDataWalletPersistence,
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
        Authorization: `Bearer ${BearerAuthToken}`,
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
      return this.meUrl().andThen((meUrl) => {
        return this.ajaxUtil
          .get<DiscordGuildProfileAPIResponse[]>(new URL(meUrl), reqConfig)
          .andThen((response) => {
            const guildProfiles = response.map((profile) => {
              return new DiscordGuildProfile(
                profile.id,
                profile.name,
                profile.owner,
                profile.permissions,
                profile.icon,
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

  upsertDiscordProfile(
    discordProfile: DiscordProfile,
  ): ResultAsync<void, PersistenceError> {
    // throw new Error("Method not implemented.");
    // TODO, we need to update existing profile.
    return this.persistence.updateRecord(
      ERecordKey.SOCIAL_ACCOUNT,
      new VolatileStorageMetadata<DiscordProfile>(
        EBackupPriority.NORMAL,
        discordProfile,
        DiscordProfile.CURRENT_VERSION,
      ),
    );
  }

  getDiscordProfiles(): ResultAsync<DiscordProfile[], PersistenceError> {
    throw new Error("Method not implemented.");
  }

  // deleteDiscordProfile(
  //   discordProfile: DiscordProfile,
  // ): ResultAsync<void, PersistenceError> {
  //   return this.persistence.deleteRecord(
  //     ERecordKey.SOCIAL_ACCOUNT,
  //     ??,
  //     EBackupPriority.NORMAL
  //   )
  // }

  upsertDiscordGuildProfiles(
    discordGuildProfiles: DiscordGuildProfile[],
  ): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  getDiscordGuildProfiles(): ResultAsync<
    DiscordGuildProfile[],
    PersistenceError
  > {
    throw new Error("Method not implemented.");
  }
}
