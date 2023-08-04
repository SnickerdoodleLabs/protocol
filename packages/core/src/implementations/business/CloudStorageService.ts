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
          //   config.dropboxRedirectUrl,
          "https://localhost:9005/settings/storage",
      );
    });
  }

  public authenticateDropbox(
    code: string,
  ): ResultAsync<AccessToken, AjaxError> {
    return this.configProvider.getConfig().andThen((config) => {
      // pass in code
      return this.ajaxUtils
        .post<{ access_token: AccessToken }>(
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
        )
        .map((tokens) => {
          console.log("Tokens are : " + JSON.stringify(tokens));

          //do some extra stuff here and return the access token
          return tokens.access_token;
        });
    });
  }

  // public getAvailableStorageOptions() {
  //     // we can check the config values
  //     // if there are credentials for provider we can add this provider as a available option
  // }
  // public getCurrentStorageOption() {
  //     // we need to check localstorage
  //     // storageUtils
  //     //return ECloudStorageOption
  // }
  // public getGDriveAuthUrl() {
  //     // return the config value
  //     // if there is no config value we can retun an error
  // }
  // public generateGDriveCredentials(code: string) {
  //     // code is authentication code
  //     // this function gonna call the Repository then the result should be stored in localstorage
  //     // return accessToken
  // }
  // public cancelGDriveAuthenticaion() {
  //     // we can remove the credentials from localstorage
  // }
  // public initGDrive(accessToken: string, path: string)() {
  //     // if the context does not have the account info then we can try to recover
  //     // accessToken is just for check we need to check the value stored in localstorage
  //     // DataWalletPersistence  change provider
  // }
}
