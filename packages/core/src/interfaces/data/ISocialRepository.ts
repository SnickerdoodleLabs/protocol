import {
  DiscordProfile,
  DiscordGuildProfile,
  PersistenceError,
  SocialProfile,
  ESocialType,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ISocialRepository {
  upsertProfile(
    discordProfile: SocialProfile,
  ): ResultAsync<void, PersistenceError>;

  getProfiles(
    type: ESocialType,
  ): ResultAsync<SocialProfile[], PersistenceError>;

  // upsertGroupProfiles(
  //   discordGuildProfiles: DiscordGuildProfile[],
  // ): ResultAsync<void, PersistenceError>;

  // getGroupProfiles(): ResultAsync<
  //   DiscordGuildProfile[],
  //   PersistenceError
  // >;
}

export const ISocialRepositoryType = Symbol.for("ISocialRepository");
