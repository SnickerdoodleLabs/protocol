import { Integer, DiscordID, Username } from "@snickerdoodlelabs/objects";

export interface DiscordProfileAPIResponse {
  id: DiscordID;
  username: Username;
  display_name: string | null;
  avatar: string | null;
  discriminator: string;
  flags: Integer;
}
