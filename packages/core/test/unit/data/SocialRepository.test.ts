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
  ESocialType,
  Integer,
  PersistenceError,
  SnowflakeID,
  SocialGroupProfile,
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
import { discordProfiles, SocialDataMock } from "@core-tests/mock/mocks";
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

    td.when(
      this.persistence.getAllByIndex<SocialProfile>(
        ERecordKey.SOCIAL_PROFILE,
        "type",
        td.matchers.anything(),
      ),
    ).thenReturn(this.socialDataMocks.getDiscordProfiles());

    td.when(
      this.persistence.updateRecord(
        ERecordKey.SOCIAL_GROUP,
        td.matchers.anything(),
      ),
    ).thenReturn(okAsync(undefined));

    td.when(
      this.persistence.getAllByIndex<SocialGroupProfile>(
        ERecordKey.SOCIAL_GROUP,
        "type",
        td.matchers.anything(),
      ),
    ).thenReturn(this.socialDataMocks.getDiscordGuildProfiles(null));
  }

  public getDiscordGuildProfiles(): ResultAsync<DiscordGuildProfile[], never> {
    return this.socialDataMocks.getDiscordGuildProfiles(null);
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

  test("get existing discord profile", async () => {
    // Acquire
    const socialMocks = new SocialRepositoryMock();
    const repository = socialMocks.factory();
    const expectedData = (
      await socialMocks.getDiscordProfiles()
    )._unsafeUnwrap();

    // Action
    const result = await repository.getProfiles(ESocialType.DISCORD);

    // Assert
    expect(result.isOk()).toBeTruthy();
    const gotData = result._unsafeUnwrap();
    expect(gotData).toEqual(expectedData);
  });
});
describe("Test social group", () => {
  test("save new discord group", async () => {
    // Acquire
    const socialMocks = new SocialRepositoryMock();
    const repository = socialMocks.factory();
    const discordGuildProfiles = (
      await socialMocks.getDiscordGuildProfiles()
    )._unsafeUnwrap();

    // Action
    const result = await repository.upsertGroupProfiles(discordGuildProfiles);

    // Assert
    expect(result.isOk()).toBeTruthy();
  });
  test("get existing discord groups", async () => {
    // Acquire
    const socialMocks = new SocialRepositoryMock();
    const repository = socialMocks.factory();
    const expectedData = (
      await socialMocks.getDiscordGuildProfiles()
    )._unsafeUnwrap();

    // Action
    const result = await repository.getGroupProfiles(ESocialType.DISCORD);

    // Assert
    expect(result.isOk()).toBeTruthy();
    const gotData = result._unsafeUnwrap();
    expect(gotData).toEqual(expectedData);
  });
});
