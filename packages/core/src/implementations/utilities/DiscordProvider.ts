import {
  BearerAuthToken,
  DiscordConfig,
  DiscordError,
  DiscordGuildProfile,
  DiscordProfile,
  OAuthError,
  URLString,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { DiscordService } from "../business/DiscordService";

import {
  IConfigProvider,
  IConfigProviderType,
  IOAuthProvider,
} from "@core/interfaces/utilities/index.js";

export class DiscordProvider implements IOAuthProvider {
  public constructor(
    @inject(IConfigProviderType)
    protected configProvider: IConfigProvider,
  ) {}

  // public installationUrl(): ResultAsync<URLString, DiscordError> {
  //   return this.configProvider.getConfig().andThen((config) => {
  //     const clientId = config.discordConfig.clientId;
  //     const oauthBaseUrl = config.discordConfig.oauthBaseUrl; // https://discord.com/api/oauth2/authorize
  //     const oauthRedirectUrl = config.discordConfig.oauthRedirectUrl;

  //     const url = URLString(
  //       `${oauthBaseUrl}?client_id=${clientId}&redirect_uri=${encodeURI(
  //         oauthRedirectUrl,
  //       )}&response_type=token&scope=identify%20guilds`, // TODO we can parameterize scope, too.
  //     );
  //     return okAsync(url);
  //   });
  //   // TODO generate with client id, redirect_uri, type, scope
  //   const url = URLString(
  //     `https://discord.com/api/oauth2/authorize?client_id=${
  //       this.clientId
  //     }&redirect_uri=${encodeURI(
  //       this.oauthRedirectUrl,
  //     )}&response_type=token&scope=identify%20guilds`, // TODO we can parameterize scope, too.
  //   );
  //   return okAsync(url);
  // }

  public createService(): ResultAsync<DiscordService, DiscordError> {
    // return errAsync(new DiscordError("init"));
    return this.configProvider.getConfig().andThen((config) => {
      // return errAsync(new DiscordError("init"))
      return okAsync(new DiscordService(config.discord));
    });
  }
}
