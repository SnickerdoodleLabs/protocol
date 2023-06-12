/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  DiscordGuildProfile,
  DiscordProfile,
  DiscordID,
  URLString,
  OAuthAuthorizationCode,
  TwitterProfile,
} from "@snickerdoodlelabs/objects";
import { errAsync, ResultAsync } from "neverthrow";
import { useAppContext } from "../../context/AppContextProvider";
import { MobileCore } from "../../services/implementations/MobileCore";

type IDiscordInitParams = {
  code?: OAuthAuthorizationCode;
};

export type ISocialMediaProfileTypes = DiscordProfile | TwitterProfile;

export interface ISocialMediaProvider {
  getUserProfiles(): ResultAsync<ISocialMediaProfileTypes[], unknown>;
}

interface IDiscordProvider extends ISocialMediaProvider {
  getGuildProfiles(): ResultAsync<DiscordGuildProfile[], unknown>;
  getUserProfiles(): ResultAsync<DiscordProfile[], unknown>;
  initializeUserWithAuthorizationCode(
    params: IDiscordInitParams,
  ): ResultAsync<void, unknown>;
  unlink(discordProfileId: DiscordID): ResultAsync<void, unknown>;
  installationUrl(): ResultAsync<URLString, unknown>;
}

export class DiscordProvider implements IDiscordProvider {
  mobileCore: MobileCore;
  constructor() {
    const { mobileCore } = useAppContext();
    this.mobileCore = mobileCore;
  }
  //SDL Connections
  public getUserProfiles(): ResultAsync<DiscordProfile[], unknown> {
    return this.mobileCore
      .getCore()
      .discord.getUserProfiles()
      .mapErr(() => new Error("Could not get discord user profiles!"));
  }
  public unlink(discordProfileId: DiscordID): ResultAsync<void, unknown> {
    return this.mobileCore
      .getCore()
      .discord.unlink(discordProfileId)
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
      return this.mobileCore
        .getCore()
        .discord.initializeUserWithAuthorizationCode(code);
    }
    return errAsync(new Error("No discord code exists!"));
  }

  public installationUrl(): ResultAsync<URLString, unknown> {
    return this.mobileCore
      .getCore()
      .discord.installationUrl()
      .mapErr(
        () => new Error("Discord installation url can not be generated!"),
      );
  }

  public getGuildProfiles(): ResultAsync<DiscordGuildProfile[], unknown> {
    return this.mobileCore
      .getCore()
      .discord.getGuildProfiles()
      .mapErr(() => new Error("Could not get discord guild profiles!"));
  }
}
