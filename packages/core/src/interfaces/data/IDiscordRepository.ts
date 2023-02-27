import {
  BearerAuthToken,
  DiscordProfile,
  DiscordError,
  DiscordGuildProfile,
  PersistenceError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IDiscordRepository {
  fetchUserProfile(
    authToken: BearerAuthToken,
  ): ResultAsync<DiscordProfile, DiscordError>;

  fetchGuildProfiles(
    authToken: BearerAuthToken,
  ): ResultAsync<DiscordGuildProfile[], DiscordError>;

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

export const IDiscordRepositoryType = Symbol.for("IDiscordRepository");
