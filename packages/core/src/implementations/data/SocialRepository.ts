import {
  EBackupPriority,
  ESocialType,
  PersistenceError,
  SocialGroupProfile,
  SocialPrimaryKey,
  SocialProfile,
  VolatileStorageMetadata,
} from "@snickerdoodlelabs/objects";
import { ERecordKey } from "@snickerdoodlelabs/persistence";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import {
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  ISocialRepository,
} from "@core/interfaces/data/index.js";
import {
  IConfigProvider,
  IConfigProviderType,
} from "@core/interfaces/utilities/IConfigProvider.js";

@injectable()
export class SocialRepository implements ISocialRepository {
  public constructor(
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IDataWalletPersistenceType)
    protected persistence: IDataWalletPersistence,
  ) {}

  public upsertProfile<T extends SocialProfile>(
    socialProfile: T,
  ): ResultAsync<void, PersistenceError> {
    return this.persistence.updateRecord(
      ERecordKey.SOCIAL_PROFILE,
      new VolatileStorageMetadata<T>(
        EBackupPriority.NORMAL,
        socialProfile,
        socialProfile.getVersion(),
      ),
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
    pKey: SocialPrimaryKey,
  ): ResultAsync<T | null, PersistenceError> {
    return this.persistence.getObject<T>(
      ERecordKey.SOCIAL_PROFILE,
      pKey,
      EBackupPriority.NORMAL,
    );
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
    return this.persistence.updateRecord(
      ERecordKey.SOCIAL_GROUP,
      new VolatileStorageMetadata<T>(
        EBackupPriority.NORMAL,
        gProfile,
        gProfile.getVersion(),
      ),
    );
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
    pKey: SocialPrimaryKey,
  ): ResultAsync<T | null, PersistenceError> {
    return this.persistence.getObject<T>(
      ERecordKey.SOCIAL_GROUP,
      pKey,
      EBackupPriority.NORMAL,
    );
  }

  deleteProfile(pKey: SocialPrimaryKey): ResultAsync<void, PersistenceError> {
    return this.persistence.deleteRecord(
      ERecordKey.SOCIAL_PROFILE,
      pKey,
      EBackupPriority.NORMAL,
    );
  }
  deleteGroupProfile(
    pKey: SocialPrimaryKey,
  ): ResultAsync<void, PersistenceError> {
    return this.persistence.deleteRecord(
      ERecordKey.SOCIAL_GROUP,
      pKey,
      EBackupPriority.NORMAL,
    );
  }
}
