import { okAsync, ResultAsync } from "neverthrow";
import { Prompt } from "@test-harness/prompts/Prompt";

export class SimulatorPrompt extends Prompt {


    public start(): ResultAsync<void, Error> {
        return okAsync(undefined);
    }
}