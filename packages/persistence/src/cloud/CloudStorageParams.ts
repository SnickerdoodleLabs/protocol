import { ECloudStorageType } from "@snickerdoodlelabs/objects";
import { IStorageUtils, IStorageUtilsType } from "@snickerdoodlelabs/utils";
import { inject, injectable } from "inversify";

import { ICloudStorageParams } from "./ICloudStorageParams";

@injectable()
export class CloudStorageParams implements ICloudStorageParams {
    public type;
    public dropboxKey;
    public dropboxSecret;

    public constructor(
        protected storageType: ECloudStorageType,
        protected dropboxAppKey: string | undefined,
        protected dropboxAppSecret: string | undefined,
    ) {
        this.dropboxKey = dropboxAppKey;
        this.dropboxSecret = dropboxAppSecret;
        this.type = storageType;
    }
}
