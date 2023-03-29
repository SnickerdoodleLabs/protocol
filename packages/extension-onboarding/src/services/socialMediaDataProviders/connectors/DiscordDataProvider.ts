/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  DiscordGuildProfile,
  DiscordProfile,
  SnowflakeID,
  URLString,
} from "@snickerdoodlelabs/objects";
import { ResultAsync, errAsync } from "neverthrow";

import {
  IDiscordDataProvider,
  IDiscordMediaDataParams,
} from "@extension-onboarding/services/socialMediaDataProviders/interfaces";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";

declare const window: IWindowWithSdlDataWallet;


export class DiscordProvider implements IDiscordDataProvider {

  protected _discordImageUrl = "https://cdn.discordapp.com";

  
  constructor() {}

  //Discord Connections
  protected async getDiscordGuildImage(
    guildId: string,
    icon: string,
    discordToken : string,
  ): Promise<string> {
    return fetch(this._discordImageUrl + `/icons/${guildId}/${icon}.png`, {
      headers: {
        authorization: `Bearer ${discordToken}`,
      },
    })
      .then((res) => res.blob())
      .then((blob) => {
        return URL.createObjectURL(blob);
      });
  }

  protected async getDiscordAvatarImages(
    avatar: string | null,
    userId: string,
    discriminator: string,
    discordToken : string,
  ): Promise<string> {
    //if user has no avatar discriminator modulo is used for default avatars
    const requestUrl =
      avatar === null
        ? `/embed/avatars/${Number(discriminator) % 5}`
        : `/avatars/${userId}/${avatar}.png`;
    return fetch(requestUrl, {
      headers: {
        authorization: `Bearer ${discordToken}`,
      },
    })
      .then((res) => res.blob())
      .then((blob) => {
        return URL.createObjectURL(blob);
      });
  }
 
  //SDL Connections
  public getUserProfiles(): ResultAsync<DiscordProfile[], unknown> {
    return window.sdlDataWallet.discord.getUserProfiles().mapErr(() => {
      return errAsync(new Error("Could not get discord user profiles!"));
    });
  }
  public unlinkAccount(discordProfileId : SnowflakeID) : ResultAsync<void,unknown> {
    return window.sdlDataWallet.discord.unlinkAccount(discordProfileId).mapErr(() => {
      return errAsync(new Error("Could not get unlink discord profile!"));
    });
  }
  
  public initializeUser(
    params: IDiscordMediaDataParams,
  ): ResultAsync<void, unknown> {
    const { discordAuthToken } = params;
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
}
