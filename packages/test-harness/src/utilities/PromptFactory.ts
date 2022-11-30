import { Environment, TestHarnessMocks } from "@test-harness/mocks/index.js";
import { ApproveQuery, CorePrompt, MainPrompt, SimulatorPrompt } from "@test-harness/prompts/index.js";
import { BusinessProfile } from "@test-harness/utilities/BusinessProfile.js";
import { DataWalletProfile } from "@test-harness/utilities//DataWalletProfile.js";
import { SnickerdoodleCore } from "@snickerdoodlelabs/core";
import { IConfigOverrides, ISnickerdoodleCore, SDQLQueryRequest } from "@snickerdoodlelabs/objects";
import { okAsync } from "neverthrow";

export class PromptFactory {

    public createDefault(): MainPrompt {
        const mocks = new TestHarnessMocks()
        
        const env = new Environment(
            new BusinessProfile(),
            mocks
        );
        
        

        return new MainPrompt(
            env,
            new CorePrompt(env),
            new SimulatorPrompt(env)
        );
    }
}