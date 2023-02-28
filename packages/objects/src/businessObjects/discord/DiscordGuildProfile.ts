import { VersionedObject } from "@objects/businessObjects/VersionedObject.js";
import {
  ISO8601DateString,
  UnixTimestamp,
  Username,
} from "@objects/primitives";
import { Integer } from "@objects/primitives/Integer";
import { SnowflakeID } from "@objects/primitives/SnowflakeID";

export class DiscordGuildProfile extends VersionedObject {
  public static CURRENT_VERSION = 1;

  public constructor(
    public id: SnowflakeID,
    public name: string,
    public isOwner: boolean,
    public permissions: Integer,
    public icon?: string,
    public joinedAt?: UnixTimestamp,
  ) {
    super();
  }

  public getVersion(): number {
    return DiscordGuildProfile.CURRENT_VERSION;
  }
}

export interface DiscordGuildProfileAPIResponse {
  id: SnowflakeID;
  name: string;
  icon?: string;
  owner: boolean;
  permissions: Integer;
}
//TODO add needed fields only
export interface DiscordGuildMembershipAPIResponse {
  is_pending: boolean;
  joined_at: ISO8601DateString;
  user: {
    id: SnowflakeID;
    username: Username;
  };
}
