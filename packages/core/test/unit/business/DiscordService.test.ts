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
import { discordProfiles } from "@core-tests/mock/mocks/SocialDataMock";
import {
  ConfigProviderMock,
  ContextProviderMock,
} from "@core-tests/mock/utilities/index.js";

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
        uProfile.oauth2Tokens.expiry = this.timeUtils.getUnixNow();
        return uProfile;
      }),
    );
  }

  public getDiscordAuthTokens() {
    return discordProfiles.map((uProfile) => uProfile.oauth2Tokens.accessToken);
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
    const result = await service.getOAuth2Tokens();

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();
    const authTokens = result._unsafeUnwrap();
    expect(authTokens).toEqual(expected);
  });
});
