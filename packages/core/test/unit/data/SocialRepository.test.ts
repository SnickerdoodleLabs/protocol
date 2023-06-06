import {
  DiscordGuildProfile,
  DiscordProfile,
  ERecordKey,
  ESocialType,
  SocialGroupProfile,
  SocialProfile,
} from "@snickerdoodlelabs/objects";
import { okAsync } from "neverthrow";
import "reflect-metadata";
import * as td from "testdouble";

import { SocialRepository } from "@core/implementations/data/index.js";
import {
  IDataWalletPersistence,
  ISocialRepository,
} from "@core/interfaces/data/index.js";
import { IConfigProvider } from "@core/interfaces/utilities/index.js";
import { SocialDataMock } from "@core-tests/mock/mocks/index.js";
import { ConfigProviderMock } from "@core-tests/mock/utilities/index.js";

class SocialRepositoryMock {
  public configProvider: IConfigProvider;
  public persistence: IDataWalletPersistence;
  protected socialDataMocks: SocialDataMock;
  public constructor() {
    this.configProvider = new ConfigProviderMock();
    this.persistence = td.object<IDataWalletPersistence>();
    this.socialDataMocks = new SocialDataMock();

    td.when(
      this.persistence.updateRecord(
        ERecordKey.SOCIAL_PROFILE,
        this.getDiscordProfiles()[0],
      ),
    ).thenReturn(okAsync(undefined));

    td.when(
      this.persistence.getAllByIndex<SocialProfile>(
        ERecordKey.SOCIAL_PROFILE,
        "type",
        td.matchers.anything(),
      ),
    ).thenReturn(okAsync(this.socialDataMocks.getDiscordProfiles()));

    this.getDiscordGuildProfiles().map((profile) =>
      td
        .when(this.persistence.updateRecord(ERecordKey.SOCIAL_GROUP, profile))
        .thenReturn(okAsync(undefined)),
    );

    td.when(
      this.persistence.getAllByIndex<SocialGroupProfile>(
        ERecordKey.SOCIAL_GROUP,
        "type",
        td.matchers.anything(),
      ),
    ).thenReturn(okAsync(this.socialDataMocks.getDiscordGuildProfiles()));
  }

  public getDiscordGuildProfiles(): DiscordGuildProfile[] {
    return this.socialDataMocks.getDiscordGuildProfiles();
  }

  public getDiscordProfiles(): DiscordProfile[] {
    return this.socialDataMocks.getDiscordProfiles();
  }

  public factory(): ISocialRepository {
    return new SocialRepository(this.persistence);
  }
}

describe("Test social profile", () => {
  test("save new discord profile", async () => {
    // Acquire
    const socialMocks = new SocialRepositoryMock();
    const repository = socialMocks.factory();
    const discordProfiles = socialMocks.getDiscordProfiles();

    // Action
    const result = await repository.upsertProfile(discordProfiles[0]);

    // Assert
    expect(result.isOk()).toBeTruthy();
  });

  test("get existing discord profile", async () => {
    // Acquire
    const socialMocks = new SocialRepositoryMock();
    const repository = socialMocks.factory();
    const expectedData = socialMocks.getDiscordProfiles();

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
    const discordGuildProfiles = socialMocks.getDiscordGuildProfiles();

    // Action
    const result = await repository.upsertGroupProfiles(discordGuildProfiles);

    // Assert
    expect(result.isOk()).toBeTruthy();
  });
  test("get existing discord groups", async () => {
    // Acquire
    const socialMocks = new SocialRepositoryMock();
    const repository = socialMocks.factory();
    const expectedData = socialMocks.getDiscordGuildProfiles();

    // Action
    const result = await repository.getGroupProfiles(ESocialType.DISCORD);

    // Assert
    expect(result.isOk()).toBeTruthy();
    const gotData = result._unsafeUnwrap();
    expect(gotData).toEqual(expectedData);
  });
});
