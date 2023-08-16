import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  IRequestConfig,
} from "@snickerdoodlelabs/common-utils";
import {
  AccessToken,
  AjaxError,
  ECloudStorageType,
  URLString,
  AuthenticatedStorageSettings,
  PersistenceError,
} from "@snickerdoodlelabs/objects";
import { inject } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import {
  IConfigProvider,
  IConfigProviderType,
} from "@core/interfaces/utilities";

enum ECloudStorageOption {
  GoogleDrive = "GoogleDrive",
  NullCloudStorage = "NullCloudStorage",
}

export interface ICloudStorageService {
  setAuthenticatedStorage(
    settings: AuthenticatedStorageSettings,
  ): ResultAsync<void, PersistenceError>;
  getDropboxAuth(): ResultAsync<URLString, never>;
  authenticateDropbox(code: string): ResultAsync<AccessToken, AjaxError>;
}

export const ICloudStorageServiceType = Symbol.for("ICloudStorageService");
