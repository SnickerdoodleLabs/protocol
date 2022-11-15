import { BusinessProfile, DataWalletProfile } from "@test-harness/utilities";
import { TestHarnessMocks } from "@test-harness/mocks/TestHarnessMocks.js";
import { InsightPlatformSimulator } from "@test-harness/mocks/InsightPlatformSimulator.js";
import { TouchableWithoutFeedbackBase } from "react-native";

export class Environment {
    public constructor(
        public businessProfile: BusinessProfile,
        public dataWalletProfile: DataWalletProfile,
        public mocks: TestHarnessMocks
    ) {}

    public get insightPlatform(): InsightPlatformSimulator {
        return this.mocks.insightSimulator;
    }

    public get unlocked(): boolean {
        return false; // TODO wire up with a state.
    }

}