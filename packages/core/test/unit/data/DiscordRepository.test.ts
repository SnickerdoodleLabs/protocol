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
  AjaxUtilsMock,
  ConfigProviderMock,
  ContextProviderMock,
} from "@core-tests/mock/utilities/index.js";

class DiscordRepositoryMock {
  public ajaxUtil: AjaxUtilsMock;
  public configProvider: IConfigProvider;
  public persistence: IDataWalletPersistence;
  protected repository: IDiscordRepository;
  protected socialRepository: ISocialRepository;
  public socialDataMocks: SocialDataMock;
  public timeUtils = new TimeUtils();

  public constructor() {
    this.socialDataMocks = new SocialDataMock();
    this.ajaxUtil = new AjaxUtilsMock();
    this.configProvider = new ConfigProviderMock();
    this.persistence = td.object<IDataWalletPersistence>();
    this.socialRepository = td.object<ISocialRepository>();
    this.repository = new DiscordRepository(
      this.ajaxUtil,
      this.configProvider,
      this.persistence,
      this.socialRepository,
      this.timeUtils,
    );

    // --- ajaxUtil td --------------------------------
    this.ajaxUtil.addGetReturn("@me", discordProfileAPIResponse);
    this.ajaxUtil.addGetReturn("@me/guilds", discordGuildProfileAPIResponses);

    // --- td social repo ---
    td.when(
      this.socialRepository.upsertProfile(td.matchers.isA(DiscordProfile)),
    ).thenReturn(okAsync(undefined));

    td.when(this.socialRepository.getProfiles(ESocialType.DISCORD)).thenReturn(
      this.socialDataMocks.getDiscordProfiles(),
    );

    td.when(
      this.socialRepository.upsertGroupProfiles(td.matchers.anything()),
    ).thenReturn(okAsync(undefined));

    td.when(
      this.socialRepository.getGroupProfiles(ESocialType.DISCORD),
    ).thenReturn(this.socialDataMocks.getDiscordGuildProfiles(null));

    td.when(
      this.socialRepository.getProfileByPK<DiscordProfile>(
        td.matchers.anything(),
      ),
    ).thenReturn(okAsync(discordProfiles[0]));

    td.when(
      this.socialRepository.getGroupProfilesByOwnerId<DiscordGuildProfile>(
        td.matchers.anything(),
      ),
    ).thenReturn(
      this.socialDataMocks.getDiscordGuildProfiles(discordProfiles[0].id),
    );

    td.when(
      this.socialRepository.deleteProfile(td.matchers.anything()),
    ).thenReturn(okAsync(undefined));

    td.when(
      this.socialRepository.deleteGroupProfile(td.matchers.anything()),
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
    const repository = mocks.factory();
    const discordProfiles = (
      await mocks.socialDataMocks.getDiscordProfiles()
    )._unsafeUnwrap();
    const expectedProfile = discordProfiles[0];

    // Act
    const result = await repository.fetchUserProfile(
      expectedProfile.oauth2Tokens,
    );

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
      await mocks.socialDataMocks.getDiscordGuildProfiles(null)
    )._unsafeUnwrap();

    // Act
    const result = await repository.fetchGuildProfiles(
      discordProfiles[0].oauth2Tokens,
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
    // Arrange
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

  test("get saved user profiles", async () => {
    const mocks = new DiscordRepositoryMock();
    const repository = mocks.factory();
    const discordProfiles = (
      await mocks.socialDataMocks.getDiscordProfiles()
    )._unsafeUnwrap();

    // Act
    const result = await repository.getUserProfiles();

    // Assert
    expect(result.isOk()).toBeTruthy();
    const userProfiles = result._unsafeUnwrap();
    expect(userProfiles).toEqual(discordProfiles);
  });

  test("save guild profiles", async () => {
    // Arrange
    const mocks = new DiscordRepositoryMock();
    const repository = mocks.factory();
    const guildProfiles = (
      await mocks.socialDataMocks.getDiscordGuildProfiles(null)
    )._unsafeUnwrap();

    // Action
    const result = await repository.upsertGuildProfiles(guildProfiles);

    // Assert
    expect(result.isOk()).toBeTruthy();
  });

  test("get saved guild profiles", async () => {
    const mocks = new DiscordRepositoryMock();
    const repository = mocks.factory();
    const expectedData = (
      await mocks.socialDataMocks.getDiscordGuildProfiles(null)
    )._unsafeUnwrap();

    // Act
    const result = await repository.getGuildProfiles();

    // Assert
    expect(result.isOk()).toBeTruthy();
    const gotData = result._unsafeUnwrap();
    expect(gotData).toEqual(expectedData);
  });

  test("delete user profile", async () => {
    // Arrange
    const mocks = new DiscordRepositoryMock();
    const repository = mocks.factory();
    const discordProfiles = (
      await mocks.socialDataMocks.getDiscordProfiles()
    )._unsafeUnwrap();
    const uProfile = discordProfiles[0];
    const guildProfiles = (
      await mocks.socialDataMocks.getDiscordGuildProfiles(uProfile.id)
    )._unsafeUnwrap();

    // Action
    const resultU = await repository.upsertUserProfile(uProfile);
    const resultG = await repository.upsertGuildProfiles(guildProfiles);
    const result = await repository.deleteProfile(uProfile.id);

    // Assert 1
    expect(result.isOk()).toBeTruthy();
  });
});
