import { ECloudStorageType } from "@snickerdoodlelabs/objects";

import { ICloudStorageParams } from "./ICloudStorageParams";

export class CloudStorageParams implements ICloudStorageParams {
    // public credentials = Map< , CloudCredential>

    public dropboxKey;
    public dropboxSecret;
    // public;

    public constructor(
        protected dropboxAppKey: string | undefined,
        protected dropboxAppSecret: string | undefined,
    ) {
        this.dropboxKey = dropboxAppKey;
        this.dropboxSecret = dropboxAppSecret;

        if (dropboxAppKey !== undefined && dropboxAppKey.length !== 0) {
            // this.authenticateDropboxCredentials;
        }
    }

    // Get rid of public function and make this a param instead
    // make thiese values instead.
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
