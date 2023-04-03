import {
  PersistenceError,
  SocialProfile,
  ESocialType,
  SocialGroupProfile,
  SocialPrimaryKey,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ISocialRepository {
  upsertProfile(
    discordProfile: SocialProfile,
  ): ResultAsync<void, PersistenceError>;

  getProfiles(
    type: ESocialType,
  ): ResultAsync<SocialProfile[], PersistenceError>;

  getProfileByPK<T extends SocialProfile>(
    pKey: SocialPrimaryKey,
  ): ResultAsync<T | null, PersistenceError>;

  upsertGroupProfiles(
    groupProfiles: SocialGroupProfile[],
  ): ResultAsync<void, PersistenceError>;

  upsertGroupProfile(
    groupProfiles: SocialGroupProfile,
  ): ResultAsync<void, PersistenceError>;

  getGroupProfiles(
    type: ESocialType,
  ): ResultAsync<SocialGroupProfile[], PersistenceError>;

  getGroupProfilesByOwnerId<T extends SocialGroupProfile>(
    ownerId: SocialPrimaryKey,
  ): ResultAsync<T[], PersistenceError>;

  getGroupProfileByPK(
    pKey: SocialPrimaryKey,
  ): ResultAsync<SocialGroupProfile | null, PersistenceError>;

  deleteProfile(pKey: SocialPrimaryKey): ResultAsync<void, PersistenceError>;
  deleteGroupProfile(
    pKey: SocialPrimaryKey,
  ): ResultAsync<void, PersistenceError>;
}

export const ISocialRepositoryType = Symbol.for("ISocialRepository");
