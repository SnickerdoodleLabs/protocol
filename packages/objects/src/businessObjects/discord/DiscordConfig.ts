import { okAsync, ResultAsync } from "neverthrow";

import { DiscordError } from "@objects/errors";
import { URLString } from "@objects/primitives/URLString";

export class DiscordConfig {
  public constructor(
    public clientId: string,
    public oauthBaseUrl: URLString,
    public oauthRedirectUrl: URLString,
  ) {}
  public getDiscordSignupUrl(): ResultAsync<URLString, DiscordError> {
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
}
