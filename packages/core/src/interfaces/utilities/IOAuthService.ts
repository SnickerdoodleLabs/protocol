import { BearerAuthToken, URLString } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { OAuthError } from "packages/objects/src/errors";

export interface IOAuthService {
  isProviderAlive(): ResultAsync<boolean, OAuthError>;
  installationUrl(): ResultAsync<URLString, OAuthError>;
  isAuthTokenValid(authToken: BearerAuthToken): ResultAsync<void, OAuthError>;
  refreshAuthToken(
    refreshToken: BearerAuthToken,
  ): ResultAsync<void, OAuthError>;
}

export const IOAuthServiceType = Symbol.for("IOAuthService");
