import {
  PersistenceError,
  SocialProfile,
  ESocialType,
  SocialGroupProfile,
  SocialPrimaryKey,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ISocialRepository {
  upsertProfile<T extends SocialProfile>(
    socialProfile: T,
  ): ResultAsync<void, PersistenceError>;

  getProfiles<T extends SocialProfile>(
    type: ESocialType,
  ): ResultAsync<T[], PersistenceError>;

  getProfileByPK<T extends SocialProfile>(
    primaryKey: SocialPrimaryKey,
  ): ResultAsync<T | null, PersistenceError>;

  upsertGroupProfiles<T extends SocialGroupProfile>(
    groupProfiles: T[],
  ): ResultAsync<void, PersistenceError>;

  upsertGroupProfile<T extends SocialGroupProfile>(
    groupProfiles: T,
  ): ResultAsync<void, PersistenceError>;

  getGroupProfiles<T extends SocialGroupProfile>(
    type: ESocialType,
  ): ResultAsync<T[], PersistenceError>;

  getGroupProfilesByOwnerId<T extends SocialGroupProfile>(
    ownerId: SocialPrimaryKey,
  ): ResultAsync<T[], PersistenceError>;

  getGroupProfileByPK<T extends SocialGroupProfile>(
    primaryKey: SocialPrimaryKey,
  ): ResultAsync<T | null, PersistenceError>;

  deleteProfile(primaryKey: SocialPrimaryKey): ResultAsync<void, PersistenceError>;
  deleteGroupProfile(
    primaryKey: SocialPrimaryKey,
  ): ResultAsync<void, PersistenceError>;
}

export const ISocialRepositoryType = Symbol.for("ISocialRepository");
