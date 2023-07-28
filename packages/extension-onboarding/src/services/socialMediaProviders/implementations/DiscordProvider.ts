/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  DiscordGuildProfile,
  DiscordProfile,
  DiscordID,
  URLString,
  ISdlDataWallet,
} from "@snickerdoodlelabs/objects";
import { errAsync, ResultAsync } from "neverthrow";

import {
  IDiscordInitParams,
  IDiscordProvider,
} from "@extension-onboarding/services/socialMediaProviders/interfaces";


export class DiscordProvider implements IDiscordProvider {
  constructor(private sdlDataWallet: ISdlDataWallet) {}

  //SDL Connections
  public getUserProfiles(): ResultAsync<DiscordProfile[], unknown> {
    return this.sdlDataWallet.discord
      .getUserProfiles()
      .mapErr(() => new Error("Could not get discord user profiles!"));
  }
  public unlink(discordProfileId: DiscordID): ResultAsync<void, unknown> {
    return this.sdlDataWallet.discord
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
      return this.sdlDataWallet.discord.initializeUserWithAuthorizationCode(
        code,
      );
    }
    return errAsync(new Error("No discord code exists!"));
  }

  public installationUrl(
    attachRedirectTabId = false,
  ): ResultAsync<URLString, unknown> {
    // Since we can't determine our tab id here in the SPA, we pass
    // any tab ID we like here, and the extension will replace it with
    // with the correct one.
    return this.sdlDataWallet.discord
      .installationUrl(attachRedirectTabId ? -1 : undefined)
      .mapErr(
        () => new Error("Discord installation url can not be generated!"),
      );
  }

  public getGuildProfiles(): ResultAsync<DiscordGuildProfile[], unknown> {
    return this.sdlDataWallet.discord
      .getGuildProfiles()
      .mapErr(() => new Error("Could not get discord guild profiles!"));
  }
}
