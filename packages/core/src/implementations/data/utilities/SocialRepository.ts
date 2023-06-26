import {
  ERecordKey,
  ESocialType,
  PersistenceError,
  SocialGroupProfile,
  SocialPrimaryKey,
  SocialProfile,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import {
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  ISocialRepository,
} from "@core/interfaces/data/index.js";

@injectable()
export class SocialRepository implements ISocialRepository {
  public constructor(
    @inject(IDataWalletPersistenceType)
    protected persistence: IDataWalletPersistence,
  ) {}

  public upsertProfile<T extends SocialProfile>(
    socialProfile: T,
  ): ResultAsync<void, PersistenceError> {
    return this.persistence.updateRecord<T>(
      ERecordKey.SOCIAL_PROFILE,
      socialProfile,
    );
  }

  public getProfiles<T extends SocialProfile>(
    type: ESocialType,
  ): ResultAsync<T[], PersistenceError> {
    return this.persistence.getAllByIndex<T>(
      ERecordKey.SOCIAL_PROFILE,
      "type",
      type,
    );
  }
  public getProfileByPK<T extends SocialProfile>(
    primaryKey: SocialPrimaryKey,
  ): ResultAsync<T | null, PersistenceError> {
    return this.persistence.getObject<T>(ERecordKey.SOCIAL_PROFILE, primaryKey);
  }

  public upsertGroupProfiles<T extends SocialGroupProfile>(
    groupProfiles: T[],
  ): ResultAsync<void, PersistenceError> {
    return ResultUtils.combine(
      groupProfiles.map((gProfile) => {
        return this.upsertGroupProfile<T>(gProfile);
      }),
    ).map(() => {});
  }

  public upsertGroupProfile<T extends SocialGroupProfile>(
    gProfile: T,
  ): ResultAsync<void, PersistenceError> {
    return this.persistence.updateRecord<T>(ERecordKey.SOCIAL_GROUP, gProfile);
  }

  public getGroupProfiles<T extends SocialGroupProfile>(
    type: ESocialType,
  ): ResultAsync<T[], PersistenceError> {
    return this.persistence.getAllByIndex<T>(
      ERecordKey.SOCIAL_GROUP,
      "type",
      type,
    );
  }

  public getGroupProfilesByOwnerId<T extends SocialGroupProfile>(
    ownerId: SocialPrimaryKey,
  ): ResultAsync<T[], PersistenceError> {
    return this.persistence.getAllByIndex<T>(
      ERecordKey.SOCIAL_GROUP,
      "ownerId",
      ownerId,
    );
  }

  public getGroupProfileByPK<T extends SocialGroupProfile>(
    primaryKey: SocialPrimaryKey,
  ): ResultAsync<T | null, PersistenceError> {
    return this.persistence.getObject<T>(ERecordKey.SOCIAL_GROUP, primaryKey);
  }

  public deleteProfile(
    primaryKey: SocialPrimaryKey,
  ): ResultAsync<void, PersistenceError> {
    return this.persistence.deleteRecord(ERecordKey.SOCIAL_PROFILE, primaryKey);
  }
  public deleteGroupProfile(
    primaryKey: SocialPrimaryKey,
  ): ResultAsync<void, PersistenceError> {
    return this.persistence.deleteRecord(ERecordKey.SOCIAL_GROUP, primaryKey);
  }
}
