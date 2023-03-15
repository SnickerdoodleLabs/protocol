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
  UnixTimestamp,
  Username,
} from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";
import * as td from "testdouble";

import { DiscordService } from "@core/implementations/business/DiscordService";
import { DiscordRepository } from "@core/implementations/data/index.js";
import { IDiscordService } from "@core/interfaces/business";
import {
  IDataWalletPersistence,
  IDiscordRepository,
  ISocialRepository,
} from "@core/interfaces/data/index.js";
import { IConfigProvider } from "@core/interfaces/utilities/index.js";
import {
  discordGuildProfileAPIResponses,
  discordProfileAPIResponse,
  discordProfiles,
  SocialDataMock,
} from "@core-tests/mock/mocks/SocialDataMock";
import {
  ConfigProviderMock,
  ContextProviderMock,
} from "@core-tests/mock/utilities/index.js";

class DiscordRepositoryMock {
  public ajaxUtil: IAxiosAjaxUtils;
  public configProvider: IConfigProvider;
  public persistence: IDataWalletPersistence;
  protected repository: IDiscordRepository;
  protected socialRepository: ISocialRepository;
  public socialDataMocks: SocialDataMock;
  public constructor() {
    this.socialDataMocks = new SocialDataMock();
    this.ajaxUtil = td.object<IAxiosAjaxUtils>();
    this.configProvider = new ConfigProviderMock();
    this.persistence = td.object<IDataWalletPersistence>();
    this.socialRepository = td.object<ISocialRepository>();
    this.repository = new DiscordRepository(
      this.ajaxUtil,
      this.configProvider,
      this.persistence,
      this.socialRepository,
    );

    // --- ajaxUtil td --------------------------------
    td.when(
      this.ajaxUtil.get<DiscordProfileAPIResponse>(
        td.matchers.contains("@me"),
        td.matchers.anything(),
      ),
    ).thenReturn(okAsync(discordProfileAPIResponse));

    td.when(
      this.ajaxUtil.get<DiscordGuildProfileAPIResponse[]>(
        td.matchers.contains("@me/guilds"),
        td.matchers.anything(),
      ),
    ).thenReturn(okAsync(discordGuildProfileAPIResponses));

    // -- social repository td ---
    td.when(
      this.socialRepository.upsertProfile(td.matchers.isA(DiscordProfile)),
    ).thenReturn(okAsync(undefined));
  }

  public factory(): IDiscordRepository {
    return this.repository;
  }
}

describe("DiscordRepository discord API fetch tests", () => {
  test("fetchUserProfile", async () => {
    // Arrange
    const mocks = new DiscordRepositoryMock();
    const service = mocks.factory();
    const discordProfiles = (
      await mocks.socialDataMocks.getDiscordProfiles()
    )._unsafeUnwrap();
    const expectedProfile = discordProfiles[0];

    // Act
    const result = await service.fetchUserProfile(expectedProfile.authToken);

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();
    const profile = result._unsafeUnwrap();
    expect(profile).toEqual(expectedProfile);
  });

  test("fetchGuildProfiles", async () => {
    // Arrange
    const mocks = new DiscordRepositoryMock();
    const repository = mocks.factory();
    const expectedProfiles = (
      await mocks.socialDataMocks.getDiscordGuildProfiles()
    )._unsafeUnwrap();

    // Act
    const result = await repository.fetchGuildProfiles(
      discordProfiles[0].authToken,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();
    const guildProfiles = result._unsafeUnwrap();
    expect(guildProfiles).toEqual(expectedProfiles);
  });
});

describe("DiscordRepository persistence tests", () => {
  test("save user profile", async () => {
    const mocks = new DiscordRepositoryMock();
    const repository = mocks.factory();
    const discordProfiles = (
      await mocks.socialDataMocks.getDiscordProfiles()
    )._unsafeUnwrap();

    // Action
    const result = await repository.upsertUserProfile(discordProfiles[0]);

    // Assert
    expect(result.isOk()).toBeTruthy();
  });
});
