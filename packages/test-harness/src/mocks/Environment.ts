import { BusinessProfile, DataWalletProfile } from "@test-harness/utilities";
import { TestHarnessMocks } from "@test-harness/mocks/TestHarnessMocks.js";
import { InsightPlatformSimulator } from "@test-harness/mocks/InsightPlatformSimulator.js";
import { ISnickerdoodleCore } from "@snickerdoodlelabs/objects";
import { SnickerdoodleCore } from "@snickerdoodlelabs/core";
import { FileInputUtils } from "@test-harness/utilities/FileInputUtils.js";
import { okAsync, Result, ResultAsync } from "neverthrow";

export class Environment {
    protected fioUtils: FileInputUtils;
    protected walletFolder = "data/profiles/dataWallet"
    public constructor(
        public businessProfile: BusinessProfile,
        public dataWalletProfile: DataWalletProfile,
        public mocks: TestHarnessMocks
    ) {
        this.fioUtils = new FileInputUtils();
    }

    public get insightPlatform(): InsightPlatformSimulator {
        return this.mocks.insightSimulator;
    }

    public get core(): SnickerdoodleCore {
        return this.dataWalletProfile.core;
    }

    public getDataWalletProfiles(): ResultAsync<{name: string, path:string}[], Error> {

        return this.fioUtils.getSubDirPaths(this.walletFolder);

    }

    public loadDataWalletProfile(profile: {name: string, path:string}): ResultAsync<void, Error> {
        return okAsync(undefined)
    }

}