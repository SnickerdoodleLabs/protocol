import { ECloudStorageType } from "@snickerdoodlelabs/objects";

import { ICloudStorageParams } from "./ICloudStorageParams";

export class CloudStorageParams implements ICloudStorageParams {
  public constructor(
    protected dropboxAppKey: string,
    protected dropboxAppSecret: string,
    protected GoogleCloudBucket: string,
    protected dataWalletAddress: string, // gcp credentials // pass in the refreshtoken from dropbox // pass in the chosen folder location into params // form factor needs a file picker correlated with dropbox (only once, first time during set up.  Then cache. )
  ) {}

  // Get rid of public function and make this a param instead
  // make thiese values instead.
  public getDropboxKey(): string {
    return this.dropboxAppKey;
  }
  public getDropboxSecret(): string {
    return this.dropboxAppSecret;
  }
  public getGCPBucket(): string {
    return this.GoogleCloudBucket;
  }
  public authenticateDropboxCredentials(): boolean {
    return true;
  }
  public authenticateGCPCredentials(): boolean {
    return true;
  }
  public dataWalletAddress(): string {
    return "";
  }

  public type(): ECloudStorageType {
    //     Snickerdoodle = "Snickerdoodle",
    //     Dropbox = "Dropbox",
    //     Local_Only = "null",
    //   }
    return ECloudStorageType.Dropbox;
  }
}
