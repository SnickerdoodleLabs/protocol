import { Integer } from "@objects/primitives/Integer";
import { SnowflakeID } from "@objects/primitives/SnowflakeID";

export class DiscordGuildProfile {
  public constructor(
    public id: SnowflakeID,
    public name: string,
    public isOwner: boolean,
    public permissions: Integer,
  ) {}
}

export interface DiscordGuildProfileAPIResponse {
  id: SnowflakeID;
  name: string;
  owner: boolean;
  permissions: Integer;
}
