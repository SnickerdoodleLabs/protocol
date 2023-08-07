import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  AuthenticatedStorageSettings,
  ECloudStorageType,
  CloudProviderSelectedEvent,
  CloudStorageError,
  URLString,
  AccessToken,
  EVMPrivateKey,
  PersistenceError,
} from "@snickerdoodlelabs/objects";
import { IStorageUtils, IStorageUtilsType } from "@snickerdoodlelabs/utils";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import {
  ICloudStorage,
  ICloudStorageType,
  IDropboxCloudStorageType,
  IGDriveCloudStorage,
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
import {
  IVolatileStorage,
  IVolatileStorageType,
} from "@persistence/volatile/IVolatileStorage.js";

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

  // check currentStorageOption from local storage if there is no value then it can return NullCloudStorage
  // then initiate the cloud storage
  public constructor(
    @inject(IGDriveCloudStorage) protected gDrive: ICloudStorage,
    @inject(IDropboxCloudStorageType) protected dropbox: ICloudStorage,
    @inject(IPersistenceContextProviderType)
    protected contextProvider: IPersistenceContextProvider,
    @inject(IPersistenceConfigProviderType)
    protected configProvider: IPersistenceConfigProvider,
    @inject(IAxiosAjaxUtilsType)
    protected ajaxUtils: IAxiosAjaxUtils,

    @inject(IStorageUtilsType)
    protected storageUtils: IStorageUtils,
    @inject(IVolatileStorageType)
    protected volatileStorage: IVolatileStorage,
  ) {
    this.storageList = new Set();

    // this is for init, how about for loading
    this.initializeResult = ResultAsync.fromSafePromise(
      new Promise((resolve) => {
        this.resolveProvider = resolve;
      }),
    );
  }

  public unlock(
    dataWalletKey: EVMPrivateKey,
  ): ResultAsync<void, PersistenceError> {
    return ResultUtils.combine([
      this.gDrive.unlock(dataWalletKey),
      this.dropbox.unlock(dataWalletKey),
    ]).map(() => {});
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
            "&response_type=code&redirect_uri=" +
            // config.dropboxRedirectUri,
            "https://localhost:9005/settings/storage",
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
  ): ResultAsync<void, never> {
    return this.contextProvider.getContext().map((context) => {
      if (credentials.type == ECloudStorageType.Dropbox) {
        this.provider = this.dropbox;
      } else if (credentials.type == ECloudStorageType.Snickerdoodle) {
        this.provider = this.gDrive;
      } else {
        // return errAsync, this means you have invalid params, OR just use NullStorage
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.resolveProvider!(this.provider);
      this.activated = true;
      context.publicEvents.onCloudStorageActivated.next(
        // TODO: Change name of this object to AuthenticatedStorageActivatedEvent
        new CloudProviderSelectedEvent(credentials.type),
      );

      if (!this.storageList.has(credentials.type)) {
        this.storageList.add(credentials.type);
      }
    });
  }

  public getCloudStorage(): ResultAsync<ICloudStorage, never> {
    return this.initializeResult;
  }

  public getCurrentCloudStorage(): ResultAsync<ECloudStorageType, never> {
    return okAsync(this.provider.name());
  }

  public getAvailableCloudStorage(): ResultAsync<
    Set<ECloudStorageType>,
    never
  > {
    return okAsync(this.storageList);
  }
}
