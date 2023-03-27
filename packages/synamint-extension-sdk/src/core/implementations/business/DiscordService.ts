import {
    BearerAuthToken,
    DiscordGuildProfile,
    DiscordProfile,
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
    initializeUser(authToken: BearerAuthToken): ResultAsync<void, SnickerDoodleCoreError> {
        return this.discordRepository.initializeUser(authToken);
    }
    installationUrl(): ResultAsync<URLString, SnickerDoodleCoreError> {
        return this.discordRepository.installationUrl()
    }
    getUserProfiles(): ResultAsync<DiscordProfile[], SnickerDoodleCoreError> {
        return this.getUserProfiles();
    }
    getGuildProfiles(): ResultAsync<DiscordGuildProfile[], SnickerDoodleCoreError> {
        return this.getGuildProfiles();
    }
  
    
  }
  