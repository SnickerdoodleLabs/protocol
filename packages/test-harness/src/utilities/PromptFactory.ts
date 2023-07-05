import { Environment, TestHarnessMocks } from "@test-harness/mocks/index.js";
import {
  CorePrompt,
  MainPrompt,
  SimulatorPrompt,
} from "@test-harness/prompts/index.js";
import { BusinessProfile } from "@test-harness/utilities/BusinessProfile.js";

export class PromptFactory {
  public createDefault(): MainPrompt {
    const mocks = new TestHarnessMocks();

    const env = new Environment(new BusinessProfile(), mocks);

    return new MainPrompt(
      env,
      new CorePrompt(env, mocks.timeUtils),
      new SimulatorPrompt(env),
    );
  }
}
