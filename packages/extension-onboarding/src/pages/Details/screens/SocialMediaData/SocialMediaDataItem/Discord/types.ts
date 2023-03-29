import { IDiscordDataProvider } from "@extension-onboarding/services/socialMediaDataProviders/interfaces";
import { BearerAuthToken, DiscordGuildProfile } from "@snickerdoodlelabs/objects";

export interface ILinkedDiscordAccount {
    name : string,
    userId : string,
    avatar : string | null,
    token : BearerAuthToken,
    discriminator : string
    servers : DiscordGuildProfile[],
  }
export interface ISocialMediaDataItemProps {
    provider: IDiscordDataProvider;
    name: string;
    icon: string;
  }
  
export interface IDiscordAuthResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
  }
  
  export interface IDiscordMediaDataServerItem {
    server : DiscordGuildProfile
  }