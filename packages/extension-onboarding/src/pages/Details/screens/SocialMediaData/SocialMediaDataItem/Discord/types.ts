import {
  BearerAuthToken,
  DiscordGuildProfile,
} from "@snickerdoodlelabs/objects";

import { IDiscordDataProvider } from "@extension-onboarding/services/socialMediaDataProviders/interfaces";

export interface ILinkedDiscordAccount {
  name: string;
  userId: string;
  avatar: string | null;
  openUnlinkModal: React.Dispatch<React.SetStateAction<boolean>>;
  setAccountIdToRemove: React.Dispatch<React.SetStateAction<string>>;
  setAccountNameToRemove: React.Dispatch<React.SetStateAction<string>>;
  discriminator: string;
  servers: DiscordGuildProfile[];
}
export interface ISocialMediaDataItemProps {
  name: string;
  icon: string;
}

export interface IDiscordMediaDataServerItem {
  server: DiscordGuildProfile;
}
