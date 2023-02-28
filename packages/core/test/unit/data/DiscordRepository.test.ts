import {
  IAxiosAjaxUtils,
  ITimeUtils,
  TimeUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  BearerAuthToken,
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

class DiscordRepositoryMock {
  public ajaxUtil: IAxiosAjaxUtils;
  public configProvider: IConfigProvider;
  public persistence: IDataWalletPersistence;
  protected repository: IDiscordRepository;
  public constructor() {
    this.ajaxUtil = td.object<IAxiosAjaxUtils>();
    this.configProvider = new ConfigProviderMock();
    this.persistence = td.object<IDataWalletPersistence>();
    this.repository = new DiscordRepository(
      this.ajaxUtil,
      this.configProvider,
      this.persistence,
    );

    // --- ajaxUtil td --------------------------------
    td.when(
      this.ajaxUtil.get<DiscordProfileAPIResponse>(
        td.matchers.contains("@me"),
        td.matchers.anything(),
      ),
    ).thenReturn(okAsync(discordProfileAPIResponse));
  }

  public factory(): IDiscordRepository {
    return this.repository;
  }
}

describe("DiscordRepository tests", () => {
  test("getAuthTokens", async () => {
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
});
