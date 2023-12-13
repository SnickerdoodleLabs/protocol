import { OAuthError, URLString } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IOAuthService {
  installationUrl(redirectTabId?: number): ResultAsync<URLString, OAuthError>;
}

export const IOAuthServiceType = Symbol.for("IOAuthService");
