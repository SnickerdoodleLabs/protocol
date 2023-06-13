import "reflect-metadata";
import { ITimeUtils } from "@snickerdoodlelabs/common-utils";
import { DiscordProfile, UnixTimestamp } from "@snickerdoodlelabs/objects";
import { okAsync } from "neverthrow";
import * as td from "testdouble";

import { DiscordService } from "@core/implementations/business/index.js";
import { IDiscordService } from "@core/interfaces/business/index.js";
import { IDiscordRepository } from "@core/interfaces/data/index.js";
import { IConfigProvider } from "@core/interfaces/utilities/index.js";
import { discordProfiles } from "@core-tests/mock/mocks/SocialDataMock.js";
import {
  ConfigProviderMock,
  ContextProviderMock,
} from "@core-tests/mock/utilities/index.js";

class DiscordServiceMocks {
  public configProvider: IConfigProvider;
  public contextProvider: ContextProviderMock;
  public discordRepo: IDiscordRepository;
  public timeUtils: ITimeUtils;

  public constructor() {
    this.configProvider = new ConfigProviderMock();
    this.contextProvider = new ContextProviderMock();
    this.discordRepo = td.object<IDiscordRepository>();
    this.timeUtils = td.object<ITimeUtils>();

    td.when(this.discordRepo.getUserProfiles()).thenReturn(
      okAsync(this.getDiscordProfiles()),
    );
  }

  protected getDiscordProfiles(): DiscordProfile[] {
    return discordProfiles.map((uProfile) => {
      uProfile.oauth2Tokens.expiry = this.getUnixNow();
      return uProfile;
    });
  }

  protected getUnixNow(): UnixTimestamp {
    return UnixTimestamp(1);
  }

  public getDiscordAuthTokens() {
    return discordProfiles.map((uProfile) => uProfile.oauth2Tokens.accessToken);
  }

  public factory(): IDiscordService {
    return new DiscordService(
      this.contextProvider,
      this.configProvider,
      this.discordRepo,
    );
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
    expect(authTokens.map((token) => token.accessToken)).toEqual(expected);
  });
});
