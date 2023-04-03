import {
  IAxiosAjaxUtilsType,
  IAxiosAjaxUtils,
  IRequestConfig,
} from "@snickerdoodlelabs/common-utils";
import {
  BearerAuthToken,
  DiscordProfile,
  DiscordError,
  DiscordGuildProfile,
  URLString,
  DiscordConfig,
  UnixTimestamp,
  DiscordProfileAPIResponse,
  DiscordGuildProfileAPIResponse,
  PersistenceError,
  EBackupPriority,
  VolatileStorageMetadata,
  SocialProfile,
  ESocialType,
  SocialGroupProfile,
  VolatileStorageDataKey,
  SocialPrimaryKey,
} from "@snickerdoodlelabs/objects";
import { ERecordKey } from "@snickerdoodlelabs/persistence";
import { inject, injectable } from "inversify";
import { errAsync, ok, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoin } from "url-join-ts";

import { IDiscordRepository } from "@core/interfaces/data/IDiscordRepository";
import {
  IDataWalletPersistenceType,
  IDataWalletPersistence,
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

  public upsertProfile(
    socialProfile: SocialProfile,
  ): ResultAsync<void, PersistenceError> {
    return this.persistence.updateRecord(
      ERecordKey.SOCIAL_PROFILE,
      new VolatileStorageMetadata<SocialProfile>(
        EBackupPriority.NORMAL,
        socialProfile,
        socialProfile.getVersion(),
      ),
    );
  }

  public getProfiles(
    type: ESocialType,
  ): ResultAsync<SocialProfile[], PersistenceError> {
    return this.persistence.getAllByIndex<SocialProfile>(
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

  public upsertGroupProfiles(
    groupProfiles: SocialGroupProfile[],
  ): ResultAsync<void, PersistenceError> {
    return ResultUtils.combine(
      groupProfiles.map((gProfile) => {
        return this.upsertGroupProfile(gProfile);
      }),
    ).map(() => {});
  }

  public getGroupProfiles(
    type: ESocialType,
  ): ResultAsync<SocialGroupProfile[], PersistenceError> {
    return this.persistence.getAllByIndex<SocialGroupProfile>(
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

  public getGroupProfileByPK(
    pKey: SocialPrimaryKey,
  ): ResultAsync<SocialGroupProfile | null, PersistenceError> {
    return this.persistence.getObject<SocialGroupProfile>(
      ERecordKey.SOCIAL_GROUP,
      pKey,
      EBackupPriority.NORMAL,
    );
  }

  public upsertGroupProfile(
    gProfile: SocialGroupProfile,
  ): ResultAsync<void, PersistenceError> {
    return this.persistence.updateRecord(
      ERecordKey.SOCIAL_GROUP,
      new VolatileStorageMetadata<SocialGroupProfile>(
        EBackupPriority.NORMAL,
        gProfile,
        gProfile.getVersion(),
      ),
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
