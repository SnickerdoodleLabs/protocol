import { DiscordGuildProfile } from "@snickerdoodlelabs/objects";

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

export interface IDiscordServerItem {
  server: DiscordGuildProfile;
}
