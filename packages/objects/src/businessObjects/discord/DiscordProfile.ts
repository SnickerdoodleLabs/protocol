import { BearerAuthToken } from "@objects/primitives/BearerAuthToken";
import { Integer } from "@objects/primitives/Integer";
import { SnowflakeID } from "@objects/primitives/SnowflakeID";
import { UnixTimestamp } from "@objects/primitives/UnixTimestamp";
import { Username } from "@objects/primitives/Username";

export class DiscordProfile {
  public constructor(
    public id: SnowflakeID,
    public username: Username,
    public displayName: string,
    public discriminator: string,
    public flags: Integer,
    public authToken: BearerAuthToken, // We can support multiple profiles with auth token saved in profile
    public authExpiry: UnixTimestamp,
  ) {}
}
