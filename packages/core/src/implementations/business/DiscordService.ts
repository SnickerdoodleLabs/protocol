import {
  BearerAuthToken,
  DiscordConfig,
  DiscordError,
  DiscordGuildProfile,
  DiscordProfile,
  OAuthError,
  URLString,
} from "@snickerdoodlelabs/objects";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { IDiscordService } from "@core/interfaces/business/IDiscordService.js";

export class DiscordService implements IDiscordService {
  public constructor(public apiConfig: DiscordConfig) {}

  public installationUrl(): ResultAsync<URLString, DiscordError> {
    // return this.configProvider.getConfig().andThen((config) => {
    //   const clientId = config.discordConfig.clientId;
    //   const oauthBaseUrl = config.discordConfig.oauthBaseUrl; // https://discord.com/api/oauth2/authorize
    //   const oauthRedirectUrl = config.discordConfig.oauthRedirectUrl;

    //   const url = URLString(
    //     `${oauthBaseUrl}?client_id=${clientId}&redirect_uri=${encodeURI(
    //       oauthRedirectUrl,
    //     )}&response_type=token&scope=identify%20guilds`, // TODO we can parameterize scope, too.
    //   );
    //   return okAsync(url);
    // });

    // TODO generate with client id, redirect_uri, type, scope
    const url = URLString(
      `https://discord.com/api/oauth2/authorize?client_id=${
        this.apiConfig.clientId
      }&redirect_uri=${encodeURI(
        this.apiConfig.oauthRedirectUrl,
      )}&response_type=token&scope=identify%20guilds`, // TODO we can parameterize scope, too.
    );
    return okAsync(url);
  }

  public isAuthTokenValid(
    authToken: BearerAuthToken,
  ): ResultAsync<void, OAuthError> {
    throw new Error("Method not implemented.");
  }
  public refreshAuthToken(
    refreshToken: BearerAuthToken,
  ): ResultAsync<void, OAuthError> {
    throw new Error("Method not implemented.");
  }

  public getUserProfile(
    authToken: BearerAuthToken,
  ): ResultAsync<DiscordProfile, DiscordError> {
    throw new Error("Method not implemented.");
  }

  public getGuildProfiles(
    authToken: BearerAuthToken,
  ): ResultAsync<DiscordGuildProfile[], DiscordError> {
    throw new Error("Method not implemented.");
  }
}
