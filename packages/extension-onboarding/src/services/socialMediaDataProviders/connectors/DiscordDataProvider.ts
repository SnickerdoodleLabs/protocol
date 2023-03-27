/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DiscordGuildProfile, DiscordProfile, URLString } from "@snickerdoodlelabs/objects";
import { ResultAsync, errAsync } from "neverthrow";

import { IDiscordDataProvider, IDiscordMediaDataParams } from "@extension-onboarding/services/socialMediaDataProviders/interfaces";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";

declare const window: IWindowWithSdlDataWallet;

const user = {
  "id": "80351110224678912",
  "username": "Nelly",
  "discriminator": "1337",
  "avatar": "8342729096ea3675442027381ff50dfe",
  "verified": true,
  "email": "nelly@discord.com",
  "flags": 64,
  "banner": "06c16474723fe537c283b8efa61a30c8",
  "accent_color": 16711680,
  "premium_type": 1,
  "public_flags": 64
}
export class DiscordProvider implements IDiscordDataProvider {

  constructor() {}
  public getUserProfiles(): ResultAsync<DiscordProfile[], unknown> {
    return window.sdlDataWallet.discord.getUserProfiles().mapErr( () => {
      return errAsync(new Error("Could not get discord user profiles!"));
  });
  }
  public initializeUser(params : IDiscordMediaDataParams): ResultAsync<void, unknown> {
    const { discordAuthToken } = params;
    if(discordAuthToken){
      return window.sdlDataWallet.discord.initializeUser(discordAuthToken)
    }
    return errAsync(new Error("No discord token exists!"));
    
  }

  public installationUrl(): ResultAsync<URLString, unknown> {
    return window.sdlDataWallet.discord.installationUrl().mapErr( () => {
      return errAsync(new Error("Discord installation url can not be generated!"));
    })
  }
  
  public getGuildProfiles(): ResultAsync<DiscordGuildProfile[], unknown> {
    return window.sdlDataWallet.discord.getGuildProfiles().mapErr( () => {
      return errAsync(new Error("Could not get discord guild profiles!"));
  });
  }
}
