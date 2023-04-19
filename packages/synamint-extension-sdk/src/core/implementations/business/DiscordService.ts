import {
  DiscordGuildProfile,
  DiscordID,
  DiscordProfile,
  OAuthAuthorizationCode,
  URLString,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IDiscordService } from "@synamint-extension-sdk/core/interfaces/business";
import {
  IDiscordRepository,
  IDiscordRepositoryType,
} from "@synamint-extension-sdk/core/interfaces/data";
import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared";

@injectable()
export class DiscordService implements IDiscordService {
  constructor(
    @inject(IDiscordRepositoryType)
    protected discordRepository: IDiscordRepository,
  ) {}

  public initializeUserWithAuthorizationCode(
    code: OAuthAuthorizationCode,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.discordRepository.initializeUserWithAuthorizationCode(code);
  }

  public installationUrl(): ResultAsync<URLString, SnickerDoodleCoreError> {
    return this.discordRepository.installationUrl();
  }
  public getUserProfiles(): ResultAsync<
    DiscordProfile[],
    SnickerDoodleCoreError
  > {
    return this.discordRepository.getUserProfiles();
  }
  public getGuildProfiles(): ResultAsync<
    DiscordGuildProfile[],
    SnickerDoodleCoreError
  > {
    return this.discordRepository.getGuildProfiles();
  }
  public unlink(
    discordProfileId: DiscordID,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.discordRepository.unlink(discordProfileId);
  }
}
