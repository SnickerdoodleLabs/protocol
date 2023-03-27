import { ResultAsync } from "neverthrow";

import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared/objects/errors";
import { BearerAuthToken, DiscordGuildProfile, DiscordProfile, URLString } from "@snickerdoodlelabs/objects";
export interface IDiscordRepository {
    initializeUser(
        authToken: BearerAuthToken,
    ): ResultAsync<void,SnickerDoodleCoreError>;

    installationUrl(): ResultAsync<URLString, SnickerDoodleCoreError>

    getUserProfiles(): ResultAsync<DiscordProfile[], SnickerDoodleCoreError>;
    getGuildProfiles(): ResultAsync<DiscordGuildProfile[], SnickerDoodleCoreError>;
  
}

export const IDiscordRepositoryType = Symbol.for("IDiscordRepository");