import { UUID } from "@objects/primitives";
import { Integer } from "@objects/primitives/Integer";
import { SnowflakeID } from "@objects/primitives/SnowflakeID";

export class DiscordGuildProfile {
  public constructor(
    public id: SnowflakeID,
    public name: string,
    public isOwner: boolean,
    public permissions: Integer,
    public icon?: string,
  ) {}
}

export interface DiscordGuildProfileAPIResponse {
  id: SnowflakeID;
  name: string;
  icon?: string;
  owner: boolean;
  permissions: Integer;
}
