import { ResultAsync } from "neverthrow";

import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared/objects/errors";
import { BearerAuthToken, DiscordGuildProfile, DiscordProfile, SnowflakeID, URLString } from "@snickerdoodlelabs/objects";
export interface IDiscordRepository {
    initializeUser(
        authToken: BearerAuthToken,
    ): ResultAsync<void,SnickerDoodleCoreError>;
    installationUrl(): ResultAsync<URLString, SnickerDoodleCoreError>
    getUserProfiles(): ResultAsync<DiscordProfile[], SnickerDoodleCoreError>;
    getGuildProfiles(): ResultAsync<DiscordGuildProfile[], SnickerDoodleCoreError>;
    unlink( discordProfileId : SnowflakeID): ResultAsync<void, SnickerDoodleCoreError>;
}

export const IDiscordRepositoryType = Symbol.for("IDiscordRepository");