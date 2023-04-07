/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  DiscordGuildProfile,
  DiscordProfile,
  SnowflakeID,
  URLString,
} from "@snickerdoodlelabs/objects";
import { errAsync, ResultAsync } from "neverthrow";

import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import {
  IDiscordInitParams,
  IDiscordProvider,
} from "@extension-onboarding/services/socialMediaProviders/interfaces";

declare const window: IWindowWithSdlDataWallet;

export class DiscordProvider implements IDiscordProvider {
  constructor() {}
  //SDL Connections
  public getUserProfiles(): ResultAsync<DiscordProfile[], unknown> {
    return window.sdlDataWallet.discord
      .getUserProfiles()
      .mapErr(() => new Error("Could not get discord user profiles!"));
  }
  public unlink(discordProfileId: SnowflakeID): ResultAsync<void, unknown> {
    return window.sdlDataWallet.discord
      .unlink(discordProfileId)
      .mapErr(() => new Error("Could not get unlink discord profile!"));
  }

  public initializeUserWithAuthorizationCode(
    params: IDiscordInitParams,
  ): ResultAsync<void, unknown> {
    const { code } = params;
    if (code) {
      console.log(
        "DiscordProvider: initializeUserWithAuthorizationCode with code",
        code,
      );
      return window.sdlDataWallet.discord.initializeUserWithAuthorizationCode(
        code,
      );
    }
    return errAsync(new Error("No discord code exists!"));
  }

  public installationUrl(): ResultAsync<URLString, unknown> {
    return window.sdlDataWallet.discord
      .installationUrl()
      .mapErr(
        () => new Error("Discord installation url can not be generated!"),
      );
  }

  public getGuildProfiles(): ResultAsync<DiscordGuildProfile[], unknown> {
    return window.sdlDataWallet.discord
      .getGuildProfiles()
      .mapErr(() => new Error("Could not get discord guild profiles!"));
  }
}
