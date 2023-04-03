import { BearerAuthToken, URLString } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { OAuthError } from "packages/objects/src/errors";

export interface IOAuthService {
  installationUrl(): ResultAsync<URLString, OAuthError>;
}

export const IOAuthServiceType = Symbol.for("IOAuthService");
