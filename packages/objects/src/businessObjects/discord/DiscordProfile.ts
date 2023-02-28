import { VersionedObject } from "@objects/businessObjects/VersionedObject.js";
import { BearerAuthToken } from "@objects/primitives/BearerAuthToken";
import { Integer } from "@objects/primitives/Integer";
import { SnowflakeID } from "@objects/primitives/SnowflakeID";
import { UnixTimestamp } from "@objects/primitives/UnixTimestamp";
import { Username } from "@objects/primitives/Username";

export class DiscordProfile extends VersionedObject {
  public static CURRENT_VERSION = 1;

  public constructor(
    public id: SnowflakeID,
    public username: Username,
    public displayName: string | null,
    public discriminator: string,
    public flags: Integer,
    public authToken: BearerAuthToken, // We can support multiple profiles with auth token saved in profile
    public authExpiry: UnixTimestamp,
  ) {
    super();
  }

  public getVersion(): number {
    return DiscordProfile.CURRENT_VERSION;
  }
}

export interface DiscordProfileAPIResponse {
  id: SnowflakeID;
  username: Username;
  display_name: string;
  discriminator: string;
  flags: Integer;
}
