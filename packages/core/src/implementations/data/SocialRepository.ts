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
} from "@snickerdoodlelabs/objects";
import { ERecordKey } from "@snickerdoodlelabs/persistence";
import { inject, injectable } from "inversify";
import { errAsync, ok, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoin } from "url-join-ts";

import {
  IDataWalletPersistenceType,
  IDataWalletPersistence,
  ISocialRepository,
} from "@core/interfaces/data";
import { IDiscordRepository } from "@core/interfaces/data/IDiscordRepository";
import {
  IConfigProvider,
  IConfigProviderType,
} from "@core/interfaces/utilities/IConfigProvider";

@injectable()
export class SocialRepository implements ISocialRepository {
  public constructor(
    @inject(IAxiosAjaxUtilsType) protected ajaxUtil: IAxiosAjaxUtils,
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

  public getProfiles(): ResultAsync<SocialProfile[], PersistenceError> {
    return this.persistence.getAll<SocialProfile>(ERecordKey.SOCIAL_PROFILE);
  }

  public upsertDiscordGuildProfiles(
    discordGuildProfiles: DiscordGuildProfile[],
  ): ResultAsync<void, PersistenceError> {
    return ResultUtils.combine(
      discordGuildProfiles.map((dProfile) => {
        return this.upsertDiscordGuildProfile(dProfile);
      }),
    ).map(() => undefined);
  }

  public upsertDiscordGuildProfile(
    discordGuildProfile: DiscordGuildProfile,
  ): ResultAsync<void, PersistenceError> {
    // TODO, we need to update existing profile.
    return this.persistence.updateRecord(
      ERecordKey.SOCIAL_GROUP,
      new VolatileStorageMetadata<DiscordGuildProfile>(
        EBackupPriority.NORMAL,
        discordGuildProfile,
        DiscordProfile.CURRENT_VERSION,
      ),
    );
  }

  public getDiscordGuildProfiles(): ResultAsync<
    DiscordGuildProfile[],
    PersistenceError
  > {
    return this.persistence.getAll<DiscordGuildProfile>(
      ERecordKey.SOCIAL_GROUP,
      undefined,
      EBackupPriority.NORMAL,
    );
  }
}
