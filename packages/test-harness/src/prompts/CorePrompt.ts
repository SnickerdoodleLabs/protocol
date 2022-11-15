import { okAsync, ResultAsync } from "neverthrow";
import { Prompt } from "@test-harness/prompts/Prompt.js";

export class CorePrompt extends Prompt {

    public start(): ResultAsync<void, Error> {
        return okAsync(undefined);
    }

}