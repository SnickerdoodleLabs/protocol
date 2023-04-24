import { Integer, SnowflakeID, Username } from "@snickerdoodlelabs/objects";

export interface DiscordProfileAPIResponse {
  id: SnowflakeID;
  username: Username;
  display_name: string | null;
  avatar: string | null;
  discriminator: string;
  flags: Integer;
}
