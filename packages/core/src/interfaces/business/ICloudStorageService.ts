import {
  AccessToken,
  AjaxError,
  URLString,
  AuthenticatedStorageSettings,
  PersistenceError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ICloudStorageService {
  initialize(): ResultAsync<void, PersistenceError>;
  setAuthenticatedStorage(
    settings: AuthenticatedStorageSettings,
  ): ResultAsync<void, PersistenceError>;
  getDropboxAuth(): ResultAsync<URLString, never>;
  authenticateDropbox(code: string): ResultAsync<AccessToken, AjaxError>;
}

export const ICloudStorageServiceType = Symbol.for("ICloudStorageService");
