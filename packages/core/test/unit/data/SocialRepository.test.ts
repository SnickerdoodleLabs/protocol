import "reflect-metadata";
import {
  IAxiosAjaxUtils,
  ITimeUtils,
  TimeUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  BearerAuthToken,
  DiscordGuildProfile,
  DiscordGuildProfileAPIResponse,
  DiscordProfile,
  DiscordProfileAPIResponse,
  Integer,
  PersistenceError,
  SnowflakeID,
  SocialProfile,
  UnixTimestamp,
  Username,
} from "@snickerdoodlelabs/objects";
import { ERecordKey } from "@snickerdoodlelabs/persistence";
import { okAsync, ResultAsync } from "neverthrow";
import { async } from "rxjs";
import * as td from "testdouble";

import { DiscordService } from "@core/implementations/business/DiscordService";
import {
  DiscordRepository,
  SocialRepository,
} from "@core/implementations/data/index.js";
import { IDiscordService } from "@core/interfaces/business";
import {
  IDataWalletPersistence,
  IDiscordRepository,
  ISocialRepository,
} from "@core/interfaces/data/index.js";
import { IConfigProvider } from "@core/interfaces/utilities/index.js";
import { SocialDataMock } from "@core-tests/mock/mocks";
import {
  ConfigProviderMock,
  ContextProviderMock,
} from "@core-tests/mock/utilities/index.js";

class SocialRepositoryMock {
  public configProvider: IConfigProvider;
  public persistence: IDataWalletPersistence;
  protected repository: ISocialRepository;
  protected socialDataMocks: SocialDataMock;
  public constructor() {
    this.configProvider = new ConfigProviderMock();
    this.persistence = td.object<IDataWalletPersistence>();
    this.repository = new SocialRepository(
      this.configProvider,
      this.persistence,
    );
    this.socialDataMocks = new SocialDataMock();

    td.when(
      this.persistence.updateRecord(
        ERecordKey.SOCIAL_PROFILE,
        td.matchers.anything(),
      ),
    ).thenReturn(okAsync(undefined));
  }

  public getDiscordGuildProfiles(): ResultAsync<DiscordGuildProfile[], never> {
    return this.socialDataMocks.getDiscordGuildProfiles();
  }

  public getDiscordProfiles(): ResultAsync<DiscordProfile[], never> {
    return this.socialDataMocks.getDiscordProfiles();
  }

  public factory(): ISocialRepository {
    return this.repository;
  }
}

describe("Test social profile", () => {
  test("save new discord profile", async () => {
    // Acquire
    const socialMocks = new SocialRepositoryMock();
    const repository = socialMocks.factory();
    const discordProfiles = (
      await socialMocks.getDiscordProfiles()
    )._unsafeUnwrap();

    // Action
    const result = await repository.upsertProfile(discordProfiles[0]);

    // Assert
    expect(result.isOk()).toBeTruthy();
  });
});
describe("Test social group", () => {
  // TODO
});
