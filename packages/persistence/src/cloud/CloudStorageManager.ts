import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
} from "@snickerdoodlelabs/common-utils";
import { CryptoUtils, ICryptoUtilsType } from "@snickerdoodlelabs/node-utils";
import {
  AuthenticatedStorageSettings,
  ECloudStorageType,
  CloudStorageActivatedEvent,
  URLString,
  PersistenceError,
  OAuthURLState,
  EOAuthProvider,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import {
  ICloudStorage,
  IDropboxCloudStorageType,
  INullCloudStorageType,
} from "@persistence/cloud/ICloudStorage.js";
import { ICloudStorageManager } from "@persistence/cloud/ICloudStorageManager.js";
import { NullCloudStorage } from "@persistence/cloud/NullCloudStorage.js";
import {
  IPersistenceConfigProvider,
  IPersistenceConfigProviderType,
} from "@persistence/IPersistenceConfigProvider.js";
import {
  IPersistenceContextProvider,
  IPersistenceContextProviderType,
} from "@persistence/IPersistenceContextProvider.js";

/*
    Cloud Storage Manager Object looks for 1 instance ICloudStorage to be present at all times. 
    The user/customer can decide to switch their type of ICloudStorage provider at any time. 
    This would lead the CloudStorageManager to start an instance of the new ICloudStorage option. 
*/
@injectable()
export class CloudStorageManager implements ICloudStorageManager {
  protected provider: ICloudStorage = new NullCloudStorage();

  protected initializeResult: ResultAsync<ICloudStorage, never>;
  protected resolveProvider: null | ((provider: ICloudStorage) => void) = null;
  protected activated = false;
  protected storageList: Set<ECloudStorageType>;

  public constructor(
    @inject(INullCloudStorageType) protected localStorage: ICloudStorage,
    @inject(IDropboxCloudStorageType) protected dropbox: ICloudStorage,
    @inject(IPersistenceContextProviderType)
    protected contextProvider: IPersistenceContextProvider,
    @inject(IPersistenceConfigProviderType)
    protected configProvider: IPersistenceConfigProvider,
    @inject(ICryptoUtilsType) protected _cryptoUtils: CryptoUtils,
    @inject(IAxiosAjaxUtilsType)
    protected ajaxUtils: IAxiosAjaxUtils,
  ) {
    this.storageList = new Set();
    this.initializeResult = ResultAsync.fromSafePromise(
      new Promise((resolve) => {
        this.resolveProvider = resolve;
      }),
    );
  }

  public cloudStorageActivated(): boolean {
    return this.activated;
  }

  public getDropboxAuth(): ResultAsync<URLString, never> {
    return this.configProvider.getConfig().andThen((config) => {
      return okAsync(
        URLString(
          "https://www.dropbox.com/oauth2/authorize?client_id=" +
            config.dropboxAppKey +
            "&token_access_type=offline&response_type=code&redirect_uri=" +
            config.dropboxRedirectUri +
            `&state=${new OAuthURLState(
              EOAuthProvider.DROPBOX,
            ).getEncodedState()}`,
        ),
      );
    });
  }

  /* 
    Here we authenticate the storage provider via its AuthenticatedStorageSettings provided. 
    NOTE: This is different than setAuthenticatedStorage, which activates storage AND makes it the current provider.
  */
  public activateAuthenticatedStorage(
    credentials: AuthenticatedStorageSettings,
  ): ResultAsync<void, PersistenceError> {
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.deactivateAuthenticatedStorage(credentials),
    ]).andThen(([context, deactivated]) => {
      credentials.path = credentials.path;
      if (credentials.type == ECloudStorageType.Dropbox) {
        this.provider = this.dropbox;
      } else if (credentials.type == ECloudStorageType.Local) {
        this.provider = this.localStorage;
        return okAsync(undefined);
      } else {
        return errAsync(
          new PersistenceError("Unknown Cloud Provider Selected"),
        );
      }
      return this.provider.saveCredentials(credentials).andThen(() => {
        return this.saveParameters(credentials);
      });
    });
  }

  public deactivateAuthenticatedStorage(
    credentials: AuthenticatedStorageSettings,
  ): ResultAsync<void, PersistenceError> {
    // reset initialize result
    this.initializeResult = ResultAsync.fromSafePromise(
      new Promise((resolve) => {
        this.resolveProvider = resolve;
      }),
    );

    if (this.provider.name() == ECloudStorageType.Local) {
      return okAsync(undefined);
    }

    return this.contextProvider.getContext().andThen((context) => {
      context.publicEvents.onCloudStorageDeactivated.next(
        new CloudStorageActivatedEvent(ECloudStorageType.Dropbox),
      );

      return this.provider.clearCredentials().andThen(() => {
        return this.removeParameters(credentials);
      });

      // return okAsync(undefined);
      // return this.provider.clearCredentials(credentials);
    });
  }

  private removeParameters(
    credentials: AuthenticatedStorageSettings,
  ): ResultAsync<void, never> {
    return this.contextProvider.getContext().map((context) => {
      this.activated = false;
      if (this.storageList.has(credentials.type)) {
        this.storageList.delete(credentials.type);
      }
    });
  }

  private saveParameters(
    credentials: AuthenticatedStorageSettings,
  ): ResultAsync<void, never> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.contextProvider.getContext().map((context) => {
      this.resolveProvider!(this.provider);
      this.activated = true;
      if (credentials.type == ECloudStorageType.Dropbox) {
        context.publicEvents.onCloudStorageActivated.next(
          new CloudStorageActivatedEvent(credentials.type),
        );
      }
      if (!this.storageList.has(credentials.type)) {
        this.storageList.add(credentials.type);
      }
    });
  }

  public getCloudStorage(): ResultAsync<ICloudStorage, never> {
    return this.initializeResult.map((storage) => {
      return this.provider;
    });
  }

  public getCurrentCloudStorage(): ResultAsync<ECloudStorageType, never> {
    return okAsync(this.provider.name());
  }

  public getAvailableCloudStorageOptions(): ResultAsync<
    Set<ECloudStorageType>,
    never
  > {
    return okAsync(this.storageList);
  }
}
