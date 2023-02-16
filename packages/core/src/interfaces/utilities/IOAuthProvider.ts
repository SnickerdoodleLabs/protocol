import { BearerAuthToken, URLString } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { OAuthError } from "packages/objects/src/errors";

export interface IOAuthProvider {
  // installationUrl(): ResultAsync<URLString, OAuthError>;
}

export const IOAuthProviderType = Symbol.for("IOAuthProvider");
