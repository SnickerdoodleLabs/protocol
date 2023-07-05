import { DiscordGuildProfile } from "@snickerdoodlelabs/objects";

export interface ILinkedDiscordAccount {
  name: string;
  userId: string;
  avatar: string | null;
  discriminator: string;
  servers: DiscordGuildProfile[];
}

export interface IDiscordServerItem {
  server: DiscordGuildProfile;
}
