import {
  EOAuthRequestSource,
  OAuthError,
  URLString,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IOAuthService {
  installationUrl(
    redirectTabId?: number,
    requestSource?: EOAuthRequestSource,
  ): ResultAsync<URLString, OAuthError>;
}

export const IOAuthServiceType = Symbol.for("IOAuthService");
