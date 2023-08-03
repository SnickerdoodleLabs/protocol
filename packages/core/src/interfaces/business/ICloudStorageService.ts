import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  IRequestConfig,
} from "@snickerdoodlelabs/common-utils";
import { AccessToken, AjaxError, URLString } from "@snickerdoodlelabs/objects";
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
  getDropboxAuth(): ResultAsync<URLString, never>;
  authenticateDropbox(code: string): ResultAsync<AccessToken, AjaxError>;
}

export const ICloudStorageServiceType = Symbol.for("ICloudStorageService");
