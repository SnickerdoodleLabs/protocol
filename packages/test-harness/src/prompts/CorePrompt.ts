import { okAsync, ResultAsync } from "neverthrow";
import { Prompt } from "@test-harness/prompts/Prompt";

export class CorePrompt extends Prompt {

    public start(): ResultAsync<void, Error> {
        return okAsync(undefined);
    }

}