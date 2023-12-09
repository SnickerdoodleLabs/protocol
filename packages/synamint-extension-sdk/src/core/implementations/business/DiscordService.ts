import {
  DiscordGuildProfile,
  DiscordID,
  DiscordProfile,
  DomainName,
  EOAuthRequestSource,
  ISnickerdoodleCore,
  ISnickerdoodleCoreType,
  OAuthAuthorizationCode,
  URLString,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IDiscordService } from "@synamint-extension-sdk/core/interfaces/business";
import {
  IErrorUtils,
  IErrorUtilsType,
} from "@synamint-extension-sdk/core/interfaces/utilities";
import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared";

@injectable()
export class DiscordService implements IDiscordService {
  constructor(
    @inject(ISnickerdoodleCoreType) protected core: ISnickerdoodleCore,
    @inject(IErrorUtilsType) protected errorUtils: IErrorUtils,
  ) {}

  public initializeUserWithAuthorizationCode(
    code: OAuthAuthorizationCode,
    sourceDomain?: DomainName,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core.discord
      .initializeUserWithAuthorizationCode(code, sourceDomain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      });
  }
  public installationUrl(
    redirectTabId?: number,
    requestSource?: EOAuthRequestSource,
    sourceDomain?: DomainName,
  ): ResultAsync<URLString, SnickerDoodleCoreError> {
    return this.core.discord
      .installationUrl(redirectTabId, requestSource, sourceDomain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      });
  }
  public getUserProfiles(
    sourceDomain?: DomainName,
  ): ResultAsync<DiscordProfile[], SnickerDoodleCoreError> {
    return this.core.discord.getUserProfiles(sourceDomain).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
  public getGuildProfiles(
    sourceDomain?: DomainName,
  ): ResultAsync<DiscordGuildProfile[], SnickerDoodleCoreError> {
    return this.core.discord.getGuildProfiles(sourceDomain).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
  public unlink(
    discordProfileId: DiscordID,
    sourceDomain?: DomainName,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core.discord
      .unlink(discordProfileId, sourceDomain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      });
  }
}
