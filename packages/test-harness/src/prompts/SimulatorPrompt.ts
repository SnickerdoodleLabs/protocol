import { okAsync, ResultAsync } from "neverthrow";
import { Prompt } from "@test-harness/prompts/Prompt.js";

export class SimulatorPrompt extends Prompt {


    public start(): ResultAsync<void, Error> {
        return okAsync(undefined);
    }
}