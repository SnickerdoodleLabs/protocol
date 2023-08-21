import {
  AccessToken,
  AjaxError,
  URLString,
  AuthenticatedStorageSettings,
  PersistenceError,
  RefreshToken,
  DropboxTokens,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ICloudStorageService {
  initialize(): ResultAsync<void, PersistenceError>;
  setAuthenticatedStorage(
    settings: AuthenticatedStorageSettings,
  ): ResultAsync<void, PersistenceError>;
  getDropboxAuth(): ResultAsync<URLString, never>;
  authenticateDropbox(code: string): ResultAsync<DropboxTokens, AjaxError>;
}

export const ICloudStorageServiceType = Symbol.for("ICloudStorageService");
