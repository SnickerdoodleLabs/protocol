import {
  PersistenceError,
  SocialProfile,
  ESocialType,
  SocialGroupProfile,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ISocialRepository {
  upsertProfile(
    discordProfile: SocialProfile,
  ): ResultAsync<void, PersistenceError>;

  getProfiles(
    type: ESocialType,
  ): ResultAsync<SocialProfile[], PersistenceError>;

  upsertGroupProfiles(
    groupProfiles: SocialGroupProfile[],
  ): ResultAsync<void, PersistenceError>;

  upsertGroupProfile(
    groupProfiles: SocialGroupProfile,
  ): ResultAsync<void, PersistenceError>;

  getGroupProfiles(
    type: ESocialType,
  ): ResultAsync<SocialGroupProfile[], PersistenceError>;
}

export const ISocialRepositoryType = Symbol.for("ISocialRepository");
