/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  DiscordGuildProfile,
  DiscordProfile,
  SnowflakeID,
  URLString,
} from "@snickerdoodlelabs/objects";
import { ResultAsync, errAsync, okAsync } from "neverthrow";

import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import {
  IDiscordAuthResponse,
  IDiscordDataProvider,
  IDiscordMediaDataParams,
} from "@extension-onboarding/services/socialMediaDataProviders/interfaces";

declare const window: IWindowWithSdlDataWallet;

export class DiscordProvider implements IDiscordDataProvider {
  constructor() {}
  //TODO security! , call should be made from a server not on a client ? which we don't have here
  public getOauthTokenFromDiscord(code: string): Promise<Response> {
    return fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      body: this.discordOauthOptions(code),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  }
  //SDL Connections
  public getUserProfiles(): ResultAsync<DiscordProfile[], unknown> {
    return window.sdlDataWallet.discord.getUserProfiles().mapErr(() => {
      return errAsync(new Error("Could not get discord user profiles!"));
    });
  }
  public unlink(discordProfileId: SnowflakeID): ResultAsync<void, unknown> {
    return window.sdlDataWallet.discord.unlink(discordProfileId).mapErr(() => {
      return errAsync(new Error("Could not get unlink discord profile!"));
    });
  }

  public initializeUser(
    params: IDiscordMediaDataParams,
  ): ResultAsync<void, unknown> {
    const { discordAuthToken } = params;
    console.log(
      "DiscordProvider: initializeUser with discordAuthToken",
      discordAuthToken,
    );
    if (discordAuthToken) {
      return window.sdlDataWallet.discord.initializeUser(discordAuthToken);
    }
    return errAsync(new Error("No discord token exists!"));
  }

  public installationUrl(): ResultAsync<URLString, unknown> {
    return window.sdlDataWallet.discord.installationUrl().mapErr(() => {
      return errAsync(
        new Error("Discord installation url can not be generated!"),
      );
    });
  }

  public getGuildProfiles(): ResultAsync<DiscordGuildProfile[], unknown> {
    return window.sdlDataWallet.discord.getGuildProfiles().mapErr(() => {
      return errAsync(new Error("Could not get discord guild profiles!"));
    });
  }

  protected discordOauthOptions = (code: string) =>
    new URLSearchParams({
      client_id: "1089994449830027344",
      client_secret: "uqIyeAezm9gkqdudoPm9QB-Dec7ZylWQ",
      code,
      grant_type: "authorization_code",
      redirect_uri: `${window.location.origin}/data-dashboard/social-media-data`,
      scope: "identify guilds",
    });
}
