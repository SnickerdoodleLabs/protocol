import { okAsync, ResultAsync } from "neverthrow";

import inquirer from "inquirer";
import { Prompt } from "@test-harness/prompts/Prompt.js";
import { inquiryWrapper } from "@test-harness/prompts/inquiryWrapper.js";

export class UnlockCore extends Prompt {


    public start(): ResultAsync<void, Error> {
        return okAsync(undefined);
    }

}