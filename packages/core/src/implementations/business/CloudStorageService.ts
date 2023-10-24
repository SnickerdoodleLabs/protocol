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
  RefreshToken,
  OAuthAuthorizationCode,
  OAuth2Tokens,
  UnixTimestamp,
  OAuth2RefreshToken,
  OAuth2AccessToken,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
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
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  initialize(): ResultAsync<void, PersistenceError> {
    return this.contextProvider.getContext().map((context) => {
      context.publicEvents.onCloudStorageActivated.subscribe((event) => {
        this.logUtils.log(
          `Authenticated storage is activated. Using ${event.platform}`,
        );
        // When cloud storage is activated, we need to read the entropy from the
        // cloud storage itself. If this is differen than the current entropy, we
        // need to clear out the current volatile storage
        ResultUtils.combine([
          this.contextProvider.getContext(),
          this.entropyRepo.getDataWalletPrivateKeyFromAuthenticatedStorage(),
        ])
          .andThen(([currentContext, storedDataWalletKey]) => {
            // If there is no stored key, then we assume anything that's there is not backups and should be ignored
            if (storedDataWalletKey == null) {
              // There's nothing in the backups at all. We need to backup everything in our local storage
              return this.persistence.dumpVolatileStorage();
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
              "Key in authenticated storage differs from local data wallet key",
            );
            currentContext.dataWalletAddress = DataWalletAddress(
              storedDataWalletKey.accountAddress,
            );
            currentContext.dataWalletKey = storedDataWalletKey.privateKey;
            return this.contextProvider
              .setContext(currentContext)
              .andThen(() => {
                return this.persistence.clearVolatileStorage();
              });
          })
          .mapErr((e) => {
            this.logUtils.error(
              "Error in CloudStorageService while responding to onCloudStorageActivated event",
              e,
            );
          });
      });

      context.privateEvents.postBackupsRequested.subscribe(() => {
        this.persistence.postBackups().mapErr((e) => {
          this.logUtils.error("Error posting backups", e);
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
        if (JSON.stringify(settings) === JSON.stringify(credentials)) {
          return okAsync(undefined);
        }

        return (
          credentials
            ? this.authenticatedStorageRepo
                .deactivateAuthenticatedStorage(credentials)
                .andThen(() => {
                  return this.authenticatedStorageRepo.clearCredentials(
                    credentials,
                  );
                })
            : okAsync(undefined)
        ).andThen(() => {
          return this.authenticatedStorageRepo
            .saveCredentials(settings)
            .andThen(() => {
              return this.authenticatedStorageRepo.activateAuthenticatedStorage(
                settings,
              );
            });
        });
      });
  }

  public getDropboxAuth(): ResultAsync<URLString, never> {
    return this.configProvider.getConfig().map((config) => {
      return URLString(
        "https://www.dropbox.com/oauth2/authorize?client_id=" +
          config.dropboxAppKey +
          "&token_access_type=offline&response_type=code&redirect_uri=" +
          config.dropboxRedirectUri,
      );
    });
  }

  public authenticateDropbox(
    code: OAuthAuthorizationCode,
  ): ResultAsync<OAuth2Tokens, AjaxError> {
    return this.configProvider
      .getConfig()
      .andThen((config) => {
        // pass in code
        return this.ajaxUtils.post<{
          access_token: OAuth2AccessToken;
          refresh_token: OAuth2RefreshToken;
          expires_in: UnixTimestamp;
        }>(
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
      .map((tokens) => {
        return new OAuth2Tokens(
          tokens.access_token,
          tokens.refresh_token,
          tokens.expires_in,
        );
      });
  }
}
