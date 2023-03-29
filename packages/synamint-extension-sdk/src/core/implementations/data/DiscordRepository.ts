import {
    ISnickerdoodleCore,
    ISnickerdoodleCoreType, BearerAuthToken,
    DiscordGuildProfile,
    DiscordProfile,
    URLString,
    SnowflakeID
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import {
    IDiscordRepository
} from "@synamint-extension-sdk/core/interfaces/data";
import {
    IErrorUtils,
    IErrorUtilsType
} from "@synamint-extension-sdk/core/interfaces/utilities";
import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared/objects/errors";

@injectable()
export class DiscordRepository implements IDiscordRepository {
  constructor(
    @inject(ISnickerdoodleCoreType) protected core: ISnickerdoodleCore,
    @inject(IErrorUtilsType) protected errorUtils: IErrorUtils,
  ) {}
  initializeUser(
    authToken: BearerAuthToken,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core.discord.initializeUser(authToken).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
  installationUrl(): ResultAsync<URLString, SnickerDoodleCoreError> {
    return this.core.discord.installationUrl().mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
  getUserProfiles(): ResultAsync<DiscordProfile[], SnickerDoodleCoreError> {
    return this.core.discord.getUserProfiles().mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
  getGuildProfiles(): ResultAsync<
    DiscordGuildProfile[],
    SnickerDoodleCoreError
  > {
    return this.core.discord.getGuildProfiles().mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
  unlinkAccount( discordProfileId : SnowflakeID): ResultAsync<void, SnickerDoodleCoreError>{
    return this.core.discord.unlinkAccount(discordProfileId).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
}
