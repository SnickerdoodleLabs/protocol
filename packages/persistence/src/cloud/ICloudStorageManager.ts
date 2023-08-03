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
  AuthenticatedStorageParams,
  URLString,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { ICloudStorageParams, ICloudStorage } from "@persistence/cloud";

export interface ICloudStorageManager {
  getDropboxAuth(): ResultAsync<URLString, never>;

  activateAuthenticatedStorage(
    cloudStorageParams: AuthenticatedStorageParams,
  ): ResultAsync<void, never>;
  cloudStorageActivated(): boolean;

  getCloudStorage(): ResultAsync<ICloudStorage, never>;
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
