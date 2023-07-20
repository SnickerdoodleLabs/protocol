import {
  DiscordGuildProfile,
  DiscordProfile,
  OAuthAuthorizationCode,
  DiscordID,
  URLString,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared/objects/errors";
export interface IDiscordService {
  initializeUserWithAuthorizationCode(
    code: OAuthAuthorizationCode,
  ): ResultAsync<void, SnickerDoodleCoreError>;
  installationUrl(
    redirectTabId?: number,
  ): ResultAsync<URLString, SnickerDoodleCoreError>;
  getUserProfiles(): ResultAsync<DiscordProfile[], SnickerDoodleCoreError>;
  getGuildProfiles(): ResultAsync<
    DiscordGuildProfile[],
    SnickerDoodleCoreError
  >;
  unlink(
    discordProfileId: DiscordID,
  ): ResultAsync<void, SnickerDoodleCoreError>;
}

export const IDiscordServiceType = Symbol.for("IDiscordService");
