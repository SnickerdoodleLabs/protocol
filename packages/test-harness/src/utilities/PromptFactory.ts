import { TestHarnessMocks } from "@test-harness/mocks";
import { Environment } from "@test-harness/mocks/Environment";
import { MainPrompt } from "@test-harness/prompts";
import { CorePrompt } from "@test-harness/prompts/CorePrompt";
import { SimulatorPrompt } from "@test-harness/prompts/SimulatorPrompt";
import { BusinessProfile } from "./BusinessProfile";
import { DataWalletProfile } from "./DataWalletProfile";

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