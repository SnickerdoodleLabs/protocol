import {
  AccessToken,
  AuthenticatedStorageSettings,
  ECloudStorageType,
  EVMPrivateKey,
  PersistenceError,
  URLString,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { ICloudStorage } from "@persistence/cloud";

export interface ICloudStorageManager {
  unlock(dataWalletKey: EVMPrivateKey): ResultAsync<void, PersistenceError>;

  getDropboxAuth(): ResultAsync<URLString, never>;
  activateAuthenticatedStorage(
    settings: AuthenticatedStorageSettings,
  ): ResultAsync<void, PersistenceError>;

  deactivateCloudStorage(
    settings: AuthenticatedStorageSettings,
  ): ResultAsync<void, PersistenceError>;

  cloudStorageActivated(): boolean;

  getCloudStorage(): ResultAsync<ICloudStorage, never>;
  getCurrentCloudStorage(): ResultAsync<ECloudStorageType, never>;
  getAvailableCloudStorageOptions(): ResultAsync<Set<ECloudStorageType>, never>;
}

export const ICloudStorageManagerType = Symbol.for("ICloudStorageManager");
