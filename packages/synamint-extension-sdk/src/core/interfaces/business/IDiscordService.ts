import { ResultAsync } from "neverthrow";

import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared/objects/errors";
import { BearerAuthToken, DiscordGuildProfile, DiscordProfile, SnowflakeID, URLString } from "@snickerdoodlelabs/objects";
export interface IDiscordService {
    initializeUser(
        authToken: BearerAuthToken,
    ): ResultAsync<void,SnickerDoodleCoreError>;
    installationUrl(): ResultAsync<URLString, SnickerDoodleCoreError>
    getUserProfiles(): ResultAsync<DiscordProfile[], SnickerDoodleCoreError>;
    getGuildProfiles(): ResultAsync<DiscordGuildProfile[], SnickerDoodleCoreError>;
    unlinkAccount( discordProfileId : SnowflakeID): ResultAsync<void, SnickerDoodleCoreError>;
}

export const IDiscordServiceType = Symbol.for("IDiscordService");