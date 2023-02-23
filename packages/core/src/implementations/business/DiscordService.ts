import {
  BearerAuthToken,
  DiscordConfig,
  DiscordError,
  DiscordGuildProfile,
  DiscordProfile,
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  OAuthError,
  URLString,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IDiscordService } from "@core/interfaces/business/IDiscordService.js";
import {
  IDiscordRepository,
  IDiscordRepositoryType,
} from "@core/interfaces/data/IDiscordRepository";
import {
  IConfigProvider,
  IConfigProviderType,
} from "@core/interfaces/utilities/IConfigProvider";

@injectable()
export class DiscordService implements IDiscordService {
  public constructor(
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IDataWalletPersistenceType)
    protected dataWalletPersistence: IDataWalletPersistence,
    @inject(IDiscordRepositoryType) public repository: IDiscordRepository,
  ) {}

  protected getAPIConfig(): ResultAsync<DiscordConfig, DiscordError> {
    return this.configProvider.getConfig().andThen((config) => {
      if (config.discord == null) {
        return errAsync(new DiscordError("Discord configuration not found!"));
      }
      return okAsync(config.discord);
    });
  }

  public isProviderAlive(): ResultAsync<boolean, OAuthError> {
    throw new Error("Method not implemented.");
  }

  public installationUrl(): ResultAsync<URLString, DiscordError> {
    return this.getAPIConfig().andThen((apiConfig) => {
      const url = URLString(
        `https://discord.com/api/oauth2/authorize?client_id=${
          apiConfig.clientId
        }&redirect_uri=${encodeURI(
          apiConfig.oauthRedirectUrl,
        )}&response_type=token&scope=identify%20guilds`, // TODO we can parameterize scope, too.
      );
      return okAsync(url);
    });
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

  public initializeUser(
    authToken: BearerAuthToken,
  ): ResultAsync<void, DiscordError> {
    // 1. Fetch profile
    // 2. Update profile if exists with the same id
    // 3. Update guilds
    return ResultUtils.combine([
      this.repository.getUserProfile(authToken),
      this.repository.getGuildProfiles(authToken),
    ]).andThen(([userProfile, guildProfiles]) => {
      return ResultUtils.combine([
        this.updateUserProfile(userProfile),
        this.updateGuildProfiles(guildProfiles),
      ]).andThen(() => {
        return okAsync(undefined);
      });
    });
  }

  public getUserProfile(
    authToken: BearerAuthToken,
  ): ResultAsync<DiscordProfile, DiscordError> {
    // return this.repository.getUserProfile(authToken);
    throw new Error("Method not implemented.");
  }

  public getGuildProfiles(
    authToken: BearerAuthToken,
  ): ResultAsync<DiscordGuildProfile[], DiscordError> {
    // return this.repository.getGuildProfiles(authToken);
    throw new Error("Method not implemented.");
  }

  public updateUserProfile(
    userProfile: DiscordProfile,
  ): ResultAsync<void, DiscordError> {
    return this.dataWalletPersistence
      .upsertDiscordProfile(userProfile)
      .orElse((e) => {
        return errAsync(new DiscordError(e.message));
      });
  }
  public updateGuildProfiles(
    guildProfiles: DiscordGuildProfile[],
  ): ResultAsync<void, DiscordError> {
    return okAsync(undefined);
  }
}
