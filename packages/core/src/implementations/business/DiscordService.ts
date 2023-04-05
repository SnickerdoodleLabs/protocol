import {
  BearerAuthToken,
  DiscordConfig,
  DiscordError,
  DiscordGuildProfile,
  DiscordProfile,
  OAuth2Tokens,
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
    userProfileId: SnowflakeID,
  ): ResultAsync<void, DiscordError | PersistenceError> {
    return this.discordRepo.deleteProfile(userProfileId);
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

  public initializeUserWithAuthorizationCode(
    code: OAuthAuthorizationCode,
  ): ResultAsync<void, DiscordError | PersistenceError> {
    return this.discordRepo.getAccessToken(code).andThen((oauth2Tokens) => {
      return this.initializeUser(oauth2Tokens);
      // return ResultUtils.combine([
      //   this.discordRepo.fetchUserProfile(oauth2Tokens),
      //   this.discordRepo.fetchGuildProfiles(oauth2Tokens),
      // ]).andThen(([userProfile, guildProfiles]) => {
      //   return ResultUtils.combine([
      //     this.discordRepo.upsertUserProfile(userProfile),
      //     this.discordRepo.upsertGuildProfiles(
      //       this.addDiscordProfileIdToGuild(guildProfiles, userProfile.id),
      //     ),
      //   ]).andThen(() => {
      //     return okAsync(undefined);
      //   });
    });
  }

  protected initializeUser(
    oauth2Tokens: OAuth2Tokens,
  ): ResultAsync<void, DiscordError | PersistenceError> {
    // 1. Check auth token expritaion status if expired refresh
    // 2. Fetch profile
    // 3. Update profile if exists with the same id
    // 4. Update guilds

    console.log("Initializing user with ", oauth2Tokens);

    return this.discordRepo
      .isAuthTokenValid(oauth2Tokens)
      .andThen((isValid) => {
        if (isValid) {
          return okAsync(oauth2Tokens);
        }
        console.log("Tokens are invalid. Refreshing");
        return this.discordRepo.refreshAuthToken(oauth2Tokens.refreshToken);
      })
      .andThen((oauth2Tokens) => {
        console.log("Tokens are valid");
        return ResultUtils.combine([
          this.discordRepo.fetchUserProfile(oauth2Tokens),
          this.discordRepo.fetchGuildProfiles(oauth2Tokens),
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
    return this.getOAuth2Tokens().andThen((oauth2TokensArr) => {
      const results = oauth2TokensArr.map((oauth2Tokens) =>
        this.initializeUser(oauth2Tokens),
      );
      return ResultUtils.combine(results).andThen(() => okAsync(undefined));
    });
  }

  public getOAuth2Tokens(): ResultAsync<OAuth2Tokens[], PersistenceError> {
    return this.discordRepo.getUserProfiles().map((uProfiles) => {
      return uProfiles.map((uProfile) => uProfile.oauth2Tokens);
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
