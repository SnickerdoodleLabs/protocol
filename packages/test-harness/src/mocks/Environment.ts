import { BusinessProfile, DataWalletProfile } from "@test-harness/utilities";
import { TestHarnessMocks } from "@test-harness/mocks/TestHarnessMocks";

export class Environment {
    public constructor(
        public businessProfile: BusinessProfile,
        public dataWalletProfile: DataWalletProfile,
        public mocks: TestHarnessMocks
    ) {}
}