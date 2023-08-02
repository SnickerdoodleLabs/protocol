import {
  ECloudStorageType,
  CloudProviderSelectedEvent,
  CloudStorageError,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { AuthenticatedStorageParams } from "@snickerdoodlelabs/objects";

import {
  ICloudStorage,
  ICloudStorageType,
  IDropboxCloudStorageType,
  IGDriveCloudStorage,
} from "@persistence/cloud/ICloudStorage.js";
import { ICloudStorageManager } from "@persistence/cloud/ICloudStorageManager";
import { ICloudStorageParamsType } from "@persistence/cloud/ICloudStorageParams.js";
import { NullCloudStorage } from "@persistence/cloud/NullCloudStorage.js";
import { IPersistenceContextProvider, IPersistenceContextProviderType } from "@persistence/IPersistenceContextProvider.js";

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

  // check currentStorageOption from local storage if there is no value then it can return NullCloudStorage
  // then initiate the cloud storage
  public constructor(
    // @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IGDriveCloudStorage) protected gDrive: ICloudStorage,
    @inject(IDropboxCloudStorageType) protected dropbox: ICloudStorage, // @inject(ICloudStorageType) protected cloudStorage: ICloudStorage,
    @inject(IPersistenceContextProviderType) protected contextProvider: IPersistenceContextProvider,
  ) {
    console.log("Cloud Manager initialize called!");
    this.initializeResult = ResultAsync.fromSafePromise(new Promise((resolve) => {
      this.resolveProvider = resolve;
    }));
  }
  
  public cloudStorageActivated(): boolean {
    return this.activated;
  }

  /* 
    Initializing our CloudStorageManager
    Here we look at the CloudStorageParams passed in from the configs and build scripts. 
  */
  public activateAuthenticatedStorage(
    cloudStorageParams: AuthenticatedStorageParams,
  ): ResultAsync<void, never> {
    console.log("Cloud Manager activateAuthenticatedStorage called!");
    return this.contextProvider.getContext().map((context) => {
      if (cloudStorageParams.type == ECloudStorageType.Dropbox) {
        this.provider = this.dropbox;
      } else if (cloudStorageParams.type == ECloudStorageType.Snickerdoodle) {
        this.provider = this.gDrive;
      } else {
        // return errAsync, this means you have invalid params, OR just use NullStorage
      }
      this.resolveProvider!(this.provider);
      this.activated = true;
      context.publicEvents.onCloudStorageActivated.next(new CloudProviderSelectedEvent(ECloudStorageType.Snickerdoodle));
      console.log("Cloud Manager event called!");
    });
  }

  // cloudstoragemanager.getCloudStorage() - should indefinitely hold until storage is activated OR immediately error out
  // debug log when having no activated cloud storage yet
  // public getCloudStorage(): ResultAsync<void, never> {}
  public getCloudStorage(): ResultAsync<ICloudStorage, never> {
    return this.initializeResult;
  }
}
