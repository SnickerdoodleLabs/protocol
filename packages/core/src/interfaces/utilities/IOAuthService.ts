import { OAuthError, URLString } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IOAuthService {
  installationUrl(): ResultAsync<URLString, OAuthError>;
}

export const IOAuthServiceType = Symbol.for("IOAuthService");
