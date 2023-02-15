import {
  BearerAuthToken,
  DiscordError,
  DiscordGuildProfile,
  DiscordProfile,
  OAuthError,
  URLString,
} from "@snickerdoodlelabs/objects";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { IOAuthProvider } from "@core/interfaces/utilities/index.js";

export class DiscordProvider implements IOAuthProvider {
  public constructor(
    public clientId: string,
    public oauthBaseUrl: URLString,
    public oauthRedirectUrl: URLString,
  ) {}

  public installationUrl(): ResultAsync<URLString, DiscordError> {
    // TODO generate with client id, redirect_uri, type, scope
    const url = URLString(
      `https://discord.com/api/oauth2/authorize?client_id=${
        this.clientId
      }&redirect_uri=${encodeURI(
        this.oauthRedirectUrl,
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
