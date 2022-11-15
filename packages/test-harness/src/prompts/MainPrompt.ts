import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import inquirer from "inquirer";
import { Prompt } from "@test-harness/prompts/Prompt.js";
import { inquiryWrapper } from "@test-harness/prompts/inquiryWrapper.js";
import { Environment } from "@test-harness/mocks/Environment.js";
import { CorePrompt } from "@test-harness/prompts/CorePrompt.js";
import { SimulatorPrompt } from "@test-harness/prompts/SimulatorPrompt.js";

export class MainPrompt extends Prompt {


    public constructor(
        public env: Environment,
        public corePrompt: CorePrompt,
        public simulatorPrompt: SimulatorPrompt
    ) {
        super(env);
    }

    public start(): ResultAsync<void, Error> {

        return inquiryWrapper([
            {
                type: "list",
                name: "main",
                message: "Please select a course of action:",
                choices: [
                    { name: "Core", value: "core" },
                    new inquirer.Separator(),
                    {
                        name: "Insight Platform Simulator",
                        value: "simulator",
                    },
                    new inquirer.Separator(),
                    { name: "Nothing", value: "nothing" },
                    { name: "Exit", value: "exit", short: "e" },
                ],
            },
        ]).andThen((answers) => {
            switch (answers.main) {
                case "nothing":
                    console.log("Doing nothing for 1 second");
                    return ResultUtils.delay(1000);
                case "exit":
                    process.exit(0);
                case "core":
                    return this.corePrompt.start()
                case "simulator":
                    return this.simulatorPrompt.start()
            }
            return okAsync(undefined);
        });
    }

}