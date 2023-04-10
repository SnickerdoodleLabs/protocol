import {
  BearerAuthToken,
  DiscordGuildProfile,
  DiscordProfile,
  OAuthAuthorizationCode,
  SnowflakeID,
  URLString,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared/objects/errors";
export interface IDiscordRepository {
  initializeUserWithAuthorizationCode(
    code: OAuthAuthorizationCode,
  ): ResultAsync<void, SnickerDoodleCoreError>;
  installationUrl(): ResultAsync<URLString, SnickerDoodleCoreError>;
  getUserProfiles(): ResultAsync<DiscordProfile[], SnickerDoodleCoreError>;
  getGuildProfiles(): ResultAsync<
    DiscordGuildProfile[],
    SnickerDoodleCoreError
  >;
  unlink(
    discordProfileId: SnowflakeID,
  ): ResultAsync<void, SnickerDoodleCoreError>;
}

export const IDiscordRepositoryType = Symbol.for("IDiscordRepository");
