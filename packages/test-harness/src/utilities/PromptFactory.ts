import { Environment, TestHarnessMocks } from "@test-harness/mocks/index.js";
import { CorePrompt, MainPrompt, SimulatorPrompt } from "@test-harness/prompts/index.js";
import { BusinessProfile } from "@test-harness/utilities/BusinessProfile.js";
import { DataWalletProfile } from "@test-harness/utilities//DataWalletProfile.js";

export class PromptFactory {
    public createDefault(): MainPrompt {
        const env = new Environment(
            new BusinessProfile(),
            new DataWalletProfile(),
            new TestHarnessMocks()
        )
        return new MainPrompt(
            env,
            new CorePrompt(env),
            new SimulatorPrompt(env)
        )
    }
}