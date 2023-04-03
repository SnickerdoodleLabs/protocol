import {
  BearerAuthToken,
  DiscordAccessToken,
  DiscordConfig,
  DiscordError,
  DiscordGuildProfile,
  DiscordProfile,
  OAuthAuthorizationCode,
  OAuthError,
  PersistenceError,
  SnowflakeID,
  URLString,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IDiscordService } from "@core/interfaces/business/IDiscordService.js";
import {
  IDiscordRepository,
  IDiscordRepositoryType,
} from "@core/interfaces/data/IDiscordRepository.js";
import {
  IConfigProvider,
  IConfigProviderType,
} from "@core/interfaces/utilities/IConfigProvider.js";

@injectable()
export class DiscordService implements IDiscordService {
  public constructor(
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IDiscordRepositoryType) public discordRepo: IDiscordRepository,
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
        `https://discord.com/oauth2/authorize?client_id=${
          apiConfig.clientId
        }&redirect_uri=${encodeURI(
          apiConfig.oauthRedirectUrl,
        )}&response_type=code&scope=identify%20guilds&prompt=consent`, // TODO we can parameterize scope, too.
      );
      return okAsync(url);
    });
  }

  unlink(
    _discordProfileId: SnowflakeID,
  ): ResultAsync<void, DiscordError | PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public initializeUserWithAuthorizationCode(code: OAuthAuthorizationCode) {
    return this.discordRepo.getAccessToken(code).andThen((accessToken) => {
      return this.initializeUser(accessToken);
    });
  }

  protected initializeUser(
    accessToken: DiscordAccessToken,
  ): ResultAsync<void, DiscordError | PersistenceError> {
    // 1. Check auth token expritaion status if expired refresh
    // 2. Fetch profile
    // 3. Update profile if exists with the same id
    // 4. Update guilds

    return this.discordRepo
      .isAuthTokenValid(accessToken)
      .andThen((isValid) => {
        if (isValid) {
          return okAsync(accessToken);
        }
        return this.discordRepo.refreshAuthToken(accessToken.refresh_token);
      })
      .andThen((accessToken) => {
        return ResultUtils.combine([
          this.discordRepo.fetchUserProfile(accessToken),
          this.discordRepo.fetchGuildProfiles(accessToken),
        ]).andThen(([userProfile, guildProfiles]) => {
          return ResultUtils.combine([
            this.discordRepo.upsertUserProfile(userProfile),
            this.discordRepo.upsertGuildProfiles(
              this.addDiscordProfileIdToGuild(guildProfiles, userProfile.id),
            ),
          ]).andThen(() => {
            return okAsync(undefined);
          });
        });
      });

    // throw new Error("Method not implemented.");
  }

  public getUserProfiles(): ResultAsync<DiscordProfile[], PersistenceError> {
    return this.discordRepo.getUserProfiles();
  }

  public getGuildProfiles(): ResultAsync<
    DiscordGuildProfile[],
    PersistenceError
  > {
    return this.discordRepo.getGuildProfiles();
  }

  public poll(): ResultAsync<void, DiscordError | PersistenceError> {
    // First we need to find the authkeys for discord
    return this.getAccessTokens().andThen((accessTokens) => {
      const results = accessTokens.map((accessToken) =>
        this.initializeUser(accessToken),
      );
      return ResultUtils.combine(results).andThen(() => okAsync(undefined));
    });
  }

  protected getAccessTokens(): ResultAsync<
    DiscordAccessToken[],
    PersistenceError
  > {
    return this.discordRepo.getUserProfiles().map((uProfiles) => {
      return uProfiles.map((uProfile) => uProfile.accessToken);
    });
  }

  protected addDiscordProfileIdToGuild(
    discordGuildProfiles: DiscordGuildProfile[],
    discordProfileId: SnowflakeID,
  ): DiscordGuildProfile[] {
    return discordGuildProfiles.map((profile) => {
      profile.discordUserProfileId = discordProfileId;
      return profile;
    });
  }
}
