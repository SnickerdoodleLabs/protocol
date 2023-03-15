import "reflect-metadata";
import { ITimeUtils, TimeUtils } from "@snickerdoodlelabs/common-utils";
import {
  BearerAuthToken,
  DiscordProfile,
  Integer,
  PersistenceError,
  SnowflakeID,
  UnixTimestamp,
  Username,
} from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";
import * as td from "testdouble";

import { DiscordService } from "@core/implementations/business/DiscordService";
import { IDiscordService } from "@core/interfaces/business";
import { IDiscordRepository } from "@core/interfaces/data/index.js";
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

class DiscordServiceMocks {
  public configProvider: IConfigProvider;
  public discordRepo: IDiscordRepository;
  public timeUtils: ITimeUtils;
  public constructor() {
    this.configProvider = new ConfigProviderMock();
    this.discordRepo = td.object<IDiscordRepository>();
    this.timeUtils = new TimeUtils();

    td.when(this.discordRepo.getUserProfiles()).thenReturn(
      this.getDiscordProfiles(),
    );
  }

  protected getDiscordProfiles(): ResultAsync<
    DiscordProfile[],
    PersistenceError
  > {
    return okAsync(
      discordProfiles.map((uProfile) => {
        uProfile.authExpiry = this.timeUtils.getUnixNowMS();
        return uProfile;
      }),
    );
  }

  public getDiscordAuthTokens() {
    return discordProfiles.map((uProfile) => uProfile.authToken);
  }

  public factory(): IDiscordService {
    return new DiscordService(this.configProvider, this.discordRepo);
  }
}

describe("DiscordService tests", () => {
  test("getAuthTokens", async () => {
    // Arrange
    const mocks = new DiscordServiceMocks();
    const service = mocks.factory();
    const expected = mocks.getDiscordAuthTokens();

    // Act
    const result = await service.getAuthTokens();

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();
    const authTokens = result._unsafeUnwrap();
    expect(authTokens).toEqual(expected);
  });
});
