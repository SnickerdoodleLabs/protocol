import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  IRequestConfig,
} from "@snickerdoodlelabs/common-utils";
import {
  AccessToken,
  AjaxError,
  AuthenticatedStorageSettings,
  URLString,
  PersistenceError,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { ICloudStorageService } from "@core/interfaces/business";
import {
  IAuthenticatedStorageRepository,
  IAuthenticatedStorageRepositoryType,
} from "@core/interfaces/data/IAuthenticatedStorageRepository.js";
import {
  IDataWalletPersistence,
  IDataWalletPersistenceType,
} from "@core/interfaces/data/utilities/IDataWalletPersistence.js";
import {
  IConfigProvider,
  IConfigProviderType,
} from "@core/interfaces/utilities/IConfigProvider.js";

enum ECloudStorageOption {
  GoogleDrive = "GoogleDrive",
  NullCloudStorage = "NullCloudStorage",
}

@injectable()
export class CloudStorageService implements ICloudStorageService {
  public constructor(
    @inject(IAuthenticatedStorageRepositoryType)
    protected authenticatedStorageRepo: IAuthenticatedStorageRepository,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IAxiosAjaxUtilsType)
    protected ajaxUtils: IAxiosAjaxUtils,
    @inject(IDataWalletPersistenceType)
    protected dataWalletPersistence: IDataWalletPersistence,
  ) {}

  /**
   * This method is called from the core, and represents setting (or resetting)
   * the chosen authenticated storage system for the user. This system will be
   * put on-file and automatically used in the future
   */
  public setAuthenticatedStorage(
    settings: AuthenticatedStorageSettings,
  ): ResultAsync<void, PersistenceError> {
    // Figure out if cloud storage is already active (we have settings on file)
    return this.authenticatedStorageRepo
      .getCredentials()
      .andThen((credentials) => {
        // If we don't have settings, store them, and then activate the CloudStorageManager
        if (credentials == null) {
          return this.authenticatedStorageRepo
            .saveCredentials(settings)
            .andThen(() => {
              return this.authenticatedStorageRepo.activateAuthenticatedStorage(
                settings,
              );
            });
        }

        // If we do have settings, then we need to error or reset the cloud storage
        return errAsync(
          new PersistenceError("Cannot reset authenticated storage"),
        );
      });
  }

  public getDropboxAuth(): ResultAsync<URLString, never> {
    return this.configProvider.getConfig().map((config) => {
      return URLString(
        "https://www.dropbox.com/oauth2/authorize?client_id=" +
          config.dropboxAppKey +
          " &response_type=code&redirect_uri=" +
          config.dropboxRedirectUri,
      );
    });
  }

  public authenticateDropbox(
    code: string,
  ): ResultAsync<AccessToken, AjaxError> {
    return this.configProvider
      .getConfig()
      .andThen((config) => {
        // pass in code
        return this.ajaxUtils.post<{ access_token: AccessToken }>(
          new URL("https://api.dropbox.com/oauth2/token"),
          new URLSearchParams({
            client_id: config.dropboxAppKey,
            client_secret: config.dropboxAppSecret,
            redirect_uri: "https://localhost:9005/settings/storage",
            grant_type: "authorization_code",
            code: code,
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              accept: "*/*",
            },
          } as IRequestConfig,
        );
      })
      .map((tokens) => tokens.access_token);
  }
}
