import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ILogUtils,
  ILogUtilsType,
  IRequestConfig,
} from "@snickerdoodlelabs/common-utils";
import {
  AccessToken,
  AjaxError,
  AuthenticatedStorageSettings,
  URLString,
  PersistenceError,
  DataWalletAddress,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { ICloudStorageService } from "@core/interfaces/business/index.js";
import {
  IAuthenticatedStorageRepository,
  IAuthenticatedStorageRepositoryType,
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  IEntropyRepository,
  IEntropyRepositoryType,
} from "@core/interfaces/data/index.js";
import {
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities/index.js";

@injectable()
export class CloudStorageService implements ICloudStorageService {
  public constructor(
    @inject(IAuthenticatedStorageRepositoryType)
    protected authenticatedStorageRepo: IAuthenticatedStorageRepository,
    @inject(IEntropyRepositoryType) protected entropyRepo: IEntropyRepository,
    @inject(IDataWalletPersistenceType)
    protected persistence: IDataWalletPersistence,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IAxiosAjaxUtilsType)
    protected ajaxUtils: IAxiosAjaxUtils,
    @inject(IDataWalletPersistenceType)
    protected dataWalletPersistence: IDataWalletPersistence,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  initialize(): ResultAsync<void, PersistenceError> {
    return this.contextProvider.getContext().map((context) => {
      context.publicEvents.onCloudStorageActivated.subscribe((event) => {
        // When cloud storage is activated, we need to read the entropy from the
        // cloud storage itself. If this is differen than the current entropy, we
        // need to clear out the current volatile storage
        ResultUtils.combine([
          this.contextProvider.getContext(),
          this.entropyRepo.getDataWalletPrivateKeyFromAuthenticatedStorage(),
        ]).andThen(([currentContext, storedDataWalletKey]) => {
          // If there is no stored key, it should be stored in the next backup cycle.
          if (storedDataWalletKey == null) {
            return okAsync(undefined);
          }

          // If the keys are the same, we're fine.
          if (
            currentContext.dataWalletKey != null &&
            currentContext.dataWalletKey == storedDataWalletKey.privateKey
          ) {
            return okAsync(undefined);
          }

          // The keys are different
          // We need to clear out the volatile storage
          this.logUtils.warning(
            "Clearing volatile storage- key in authenticated storage differs from local data wallet key",
          );
          currentContext.dataWalletAddress = DataWalletAddress(
            storedDataWalletKey.accountAddress,
          );
          currentContext.dataWalletKey = storedDataWalletKey.privateKey;
          return this.contextProvider.setContext(currentContext).andThen(() => {
            return this.persistence.clearVolatileStorage();
          });
        });
      });
    });
  }

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

        return this.authenticatedStorageRepo.activateAuthenticatedStorage(
          settings,
        );

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
            redirect_uri: config.dropboxRedirectUri,
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
