import {
  DiscordGuildProfile,
  DiscordProfile,
  ISnickerdoodleCore,
  ISnickerdoodleCoreType,
  OAuthAuthorizationCode,
  DiscordID,
  URLString,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IDiscordRepository } from "@synamint-extension-sdk/core/interfaces/data";
import {
  IErrorUtils,
  IErrorUtilsType,
} from "@synamint-extension-sdk/core/interfaces/utilities";
import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared/objects/errors";

@injectable()
export class DiscordRepository implements IDiscordRepository {
  constructor(
    @inject(ISnickerdoodleCoreType) protected core: ISnickerdoodleCore,
    @inject(IErrorUtilsType) protected errorUtils: IErrorUtils,
  ) {}

  public initializeUserWithAuthorizationCode(
    code: OAuthAuthorizationCode,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core.discord
      .initializeUserWithAuthorizationCode(code)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      });
  }
  public installationUrl(): ResultAsync<URLString, SnickerDoodleCoreError> {
    return this.core.discord.installationUrl().mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
  public getUserProfiles(): ResultAsync<
    DiscordProfile[],
    SnickerDoodleCoreError
  > {
    return this.core.discord.getUserProfiles().mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
  public getGuildProfiles(): ResultAsync<
    DiscordGuildProfile[],
    SnickerDoodleCoreError
  > {
    return this.core.discord.getGuildProfiles().mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
  public unlink(
    discordProfileId: DiscordID,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core.discord.unlink(discordProfileId).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
}
