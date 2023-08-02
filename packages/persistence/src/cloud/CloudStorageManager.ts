import { ECloudStorageType } from "@snickerdoodlelabs/objects";
import { IStorageUtils, IStorageUtilsType } from "@snickerdoodlelabs/utils";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { GoogleCloudStorage, ICloudStorageType } from "@persistence/cloud";
import { CloudStorageParams } from "@persistence/cloud/CloudStorageParams.js";
import {
  ICloudStorage,
  IDropboxCloudStorageType,
  IGDriveCloudStorage,
} from "@persistence/cloud/ICloudStorage.js";
import { ICloudStorageManager } from "@persistence/cloud/ICloudStorageManager.js";
import {
  ICloudStorageParams,
  ICloudStorageParamsType,
} from "@persistence/cloud/ICloudStorageParams.js";
import { NullCloudStorage } from "@persistence/cloud/NullCloudStorage.js";

/** AUTO FORMATTER FOUND SOMEWHERE, LOOK FOR AN UNCHECK */
/*
    Cloud Storage Manager Object looks for 1 instance ICloudStorage to be present at all times. 
    The user/customer can decide to switch their type of ICloudStorage provider at any time. 
    This would lead the CloudStorageManager to start an instance of the new ICloudStorage option. 
*/
@injectable()
export class CloudStorageManager implements ICloudStorageManager {
  public provider: ICloudStorage = new NullCloudStorage();
  public cloudStorage;

  // check currentStorageOption from local storage if there is no value then it can return NullCloudStorage
  // then initiate the cloud storage
  public constructor(
    @inject(ICloudStorageParamsType)
    protected cloudStorageParams: CloudStorageParams,
    // @inject(IStorageUtilsType)
    // protected storageUtils: IStorageUtils,
    @inject(IGDriveCloudStorage) protected gDrive: ICloudStorage,
    @inject(IDropboxCloudStorageType) protected dropbox: ICloudStorage, // @inject(ICloudStorageType) protected cloudStorage: ICloudStorage,
    @inject(ICloudStorageType) protected defaultCloudStorage: ICloudStorage,
  ) {}

  /* 
        Initializing our CloudStorageManager
        Here we look at the CloudStorageParams passed in from the configs and build scripts. 
    */
  public initialize(): ResultAsync<void, never> {
    this.provider = this.defaultCloudStorage;
    // if (this.cloudStorageParams.type == ECloudStorageType.Dropbox) {
    //     this.provider = this.dropbox;
    // } else if (
    //     this.cloudStorageParams.type == ECloudStorageType.Snickerdoodle
    // ) {
    //     this.provider = this.gDrive;
    // }
    return okAsync(undefined);
  }

  /* Choosing a storage outside of onboarding requires auth tokens and a filepath */
  public setCloudStorageOption(
    authTokens: string,
    path: string,
    storageOption: ECloudStorageType,
  ): ResultAsync<void, never> {
    // emit a new event

    if (storageOption == ECloudStorageType.Dropbox) {
      this.provider = this.dropbox;
    }
    if (storageOption == ECloudStorageType.Snickerdoodle) {
      this.provider = this.gDrive;
    }
    return okAsync(undefined);
  }

  // private authenticateStorage(): ResultAsync<void, AuthenticationError> { }
}
