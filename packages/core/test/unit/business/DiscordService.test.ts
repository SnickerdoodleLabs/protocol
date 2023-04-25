import "reflect-metadata";
import { ITimeUtils, TimeUtils } from "@snickerdoodlelabs/common-utils";
import {
  OAuth1RequstToken,
  DiscordProfile,
  Integer,
  PersistenceError,
  DiscordID,
  UnixTimestamp,
  Username,
} from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";
import * as td from "testdouble";

import { DiscordService } from "@core/implementations/business/DiscordService";
import { IDiscordService } from "@core/interfaces/business";
import { IDiscordRepository } from "@core/interfaces/data/index.js";
import {
  IConfigProvider,
  IContextProvider,
} from "@core/interfaces/utilities/index.js";
import { discordProfiles } from "@core-tests/mock/mocks/SocialDataMock";
import {
  ConfigProviderMock,
  ContextProviderMock,
} from "@core-tests/mock/utilities/index.js";
import { CoreContext } from "@core/interfaces/objects";

class DiscordServiceMocks {
  public configProvider: IConfigProvider;
  public contextProvider: IContextProvider;
  public discordRepo: IDiscordRepository;
  public timeUtils: ITimeUtils;
  public constructor() {
    this.configProvider = new ConfigProviderMock();
    this.contextProvider = td.object<IContextProvider>();
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
