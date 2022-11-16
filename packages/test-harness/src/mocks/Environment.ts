import { BusinessProfile, DataWalletProfile } from "@test-harness/utilities";
import { TestHarnessMocks } from "@test-harness/mocks/TestHarnessMocks.js";
import { InsightPlatformSimulator } from "@test-harness/mocks/InsightPlatformSimulator.js";
import { ISnickerdoodleCore } from "@snickerdoodlelabs/objects";
import { SnickerdoodleCore } from "@snickerdoodlelabs/core";

export class Environment {
    public constructor(
        public businessProfile: BusinessProfile,
        public dataWalletProfile: DataWalletProfile,
        public mocks: TestHarnessMocks
    ) {}

    public get insightPlatform(): InsightPlatformSimulator {
        return this.mocks.insightSimulator;
    }

    public get core(): SnickerdoodleCore {
        return this.dataWalletProfile.core;
    }

}