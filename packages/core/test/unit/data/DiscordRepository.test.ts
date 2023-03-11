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
  ConfigProviderMock,
  ContextProviderMock,
} from "@core-tests/mock/utilities/index.js";

const discordProfiles = [
  new DiscordProfile(
    SnowflakeID("1074825823787425833"),
    Username("sdmuki"),
    null,
    "5192",
    Integer(0),
    BearerAuthToken("f0RhjaxsHvw5HqKLDsnWZdttSIODUg"),
    UnixTimestamp(0),
  ),

  new DiscordProfile(
    SnowflakeID("INVALID--SnowflakeID"),
    Username("sdmuki2"),
    null,
    "5192",
    Integer(0),
    BearerAuthToken("INVALID"),
    UnixTimestamp(0),
  ),
];

const discordProfileAPIResponse = {
  id: SnowflakeID("1074825823787425833"),
  username: Username("sdmuki"),
  display_name: null,
  discriminator: "5192",
  flags: Integer(0),
};

const discordGuildProfileAPIResponses = [
  {
    id: SnowflakeID("889939924655169616"),
    name: "NFT Worlds",
    icon: "88f2caecc154b4e2e1bcab67b7dbba7b",
    owner: false,
    permissions: Integer(0),
  },
  {
    id: SnowflakeID("916563302065274891"),
    name: "NFT Marketing Services | Growth • Management • Promotions • Marketing • Advertisements",
    icon: "a_189c4f0d955bde1f1621fd4896fd2b4c",
    owner: false,
    permissions: Integer(99328),
  },
  {
    id: SnowflakeID("1074837489417719840"),
    name: "test-server1",
    icon: null,
    owner: true,
    permissions: Integer(2147483647),
  },
];

class DiscordRepositoryMock {
  public ajaxUtil: IAxiosAjaxUtils;
  public configProvider: IConfigProvider;
  public persistence: IDataWalletPersistence;
  protected repository: IDiscordRepository;
  protected socialRepository: ISocialRepository;
  public constructor() {
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

  public getGuildProfiles(): DiscordGuildProfile[] {
    return discordGuildProfileAPIResponses.map(
      (profile) =>
        new DiscordGuildProfile(
          profile.id,
          profile.name,
          profile.owner,
          profile.permissions,
          profile.icon,
          null,
        ),
    );
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
    const service = mocks.factory();
    const expectedProfiles = mocks.getGuildProfiles();

    // Act
    const result = await service.fetchGuildProfiles(
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
  test("save user profile", () => {

  });
});
