import {
  DiscordGuildProfile,
  DiscordProfile,
  OAuthAuthorizationCode,
  DiscordID,
  URLString,
  DomainName,
  EOAuthRequestSource,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared/objects/errors";
export interface IDiscordService {
  initializeUserWithAuthorizationCode(
    code: OAuthAuthorizationCode,
    sourceDomain?: DomainName,
  ): ResultAsync<void, SnickerDoodleCoreError>;
  installationUrl(
    redirectTabId?: number,
    requestSource?: EOAuthRequestSource,
    sourceDomain?: DomainName,
  ): ResultAsync<URLString, SnickerDoodleCoreError>;
  getUserProfiles(
    sourceDomain?: DomainName,
  ): ResultAsync<DiscordProfile[], SnickerDoodleCoreError>;
  getGuildProfiles(
    sourceDomain?: DomainName,
  ): ResultAsync<DiscordGuildProfile[], SnickerDoodleCoreError>;
  unlink(
    discordProfileId: DiscordID,
    sourceDomain?: DomainName,
  ): ResultAsync<void, SnickerDoodleCoreError>;
}

export const IDiscordServiceType = Symbol.for("IDiscordService");
