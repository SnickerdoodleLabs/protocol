// import { ECloudStorageOption } from "@snickerdoodlelabs/core";
// import {
//     PersistenceError,
//     DataWalletBackup,
//     EVMPrivateKey,
//     DataWalletBackupID,
//     BackupFileName,
//     StorageKey,
//     ECloudStorageType,
// } from "@snickerdoodlelabs/objects";
import {
  AccessToken,
  AuthenticatedStorageParams,
  ECloudStorageType,
  URLString,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { ICloudStorageParams, ICloudStorage } from "@persistence/cloud";

export interface ICloudStorageManager {
  getDropboxAuth(): ResultAsync<URLString, never>;

  activateAuthenticatedStorage(
    type: ECloudStorageType,
    path: string,
    accessToken: AccessToken,
  ): ResultAsync<void, never>;
  cloudStorageActivated(): boolean;

  getCloudStorage(): ResultAsync<ICloudStorage, never>;
  getCurrentCloudStorage(): ResultAsync<ECloudStorageType, never>;
  getAvailableCloudStorage(): ResultAsync<Set<ECloudStorageType>, never>;

  // get setCloudStorageOption(
  //     authTokens,
  //     path,
  //     storageOption: ECloudStorageOption,
  // ): ResultAsync<void>;

  // cloudStorageByStorageOption(
  //     option: ECloudStorageOption,
  // ): ResultAsync<ICloudStorage>;
}

export const ICloudStorageManagerType = Symbol.for("ICloudStorageManager");
