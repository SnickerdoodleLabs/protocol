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
    name: string;
    icon: string;
  }
  

  
  export interface IDiscordMediaDataServerItem {
    server : DiscordGuildProfile
  }