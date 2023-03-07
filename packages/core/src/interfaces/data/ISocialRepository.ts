import {
  DiscordProfile,
  DiscordGuildProfile,
  PersistenceError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ISocialRepository {
  upsertDiscordProfile(
    discordProfile: DiscordProfile,
  ): ResultAsync<void, PersistenceError>;

  getDiscordProfiles(): ResultAsync<DiscordProfile[], PersistenceError>;

  upsertDiscordGuildProfiles(
    discordGuildProfiles: DiscordGuildProfile[],
  ): ResultAsync<void, PersistenceError>;

  getDiscordGuildProfiles(): ResultAsync<
    DiscordGuildProfile[],
    PersistenceError
  >;
}

export const ISocialRepositoryType = Symbol.for("ISocialRepository");
