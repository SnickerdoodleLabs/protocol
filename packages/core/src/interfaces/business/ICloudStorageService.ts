import {
  AjaxError,
  URLString,
  AuthenticatedStorageSettings,
  PersistenceError,
  OAuth2Tokens,
  OAuthAuthorizationCode,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ICloudStorageService {
  initialize(): ResultAsync<void, PersistenceError>;
  setAuthenticatedStorage(
    settings: AuthenticatedStorageSettings,
  ): ResultAsync<void, PersistenceError>;
  getDropboxAuth(): ResultAsync<URLString, never>;
  authenticateDropbox(
    code: OAuthAuthorizationCode,
  ): ResultAsync<OAuth2Tokens, AjaxError>;
}

export const ICloudStorageServiceType = Symbol.for("ICloudStorageService");
