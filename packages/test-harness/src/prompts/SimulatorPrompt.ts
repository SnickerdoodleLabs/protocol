import inquirer from "inquirer";
import { okAsync, ResultAsync } from "neverthrow";

import { Environment } from "@test-harness/mocks/Environment.js";
import { CreateCampaign } from "@test-harness/prompts/CreateCampaign.js";
import { inquiryWrapper } from "@test-harness/prompts/inquiryWrapper.js";
import { PostQuery } from "@test-harness/prompts/PostQuery.js";
import { PostQuestionnaire } from "@test-harness/prompts/PostQuestionnaire.js";
import { Prompt } from "@test-harness/prompts/Prompt.js";
import { SetMaxCapacity } from "@test-harness/prompts/SetMaxCapacity.js";

export class SimulatorPrompt extends Prompt {
  private createCampaign: CreateCampaign;
  private postQuery: PostQuery;
  private postQuestionnaire: PostQuestionnaire;
  private setMaxCapacity: SetMaxCapacity;

  public constructor(public env: Environment) {
    super(env);

    this.createCampaign = new CreateCampaign(this.env);
    this.postQuery = new PostQuery(this.env);
    this.postQuestionnaire = new PostQuestionnaire(this.env);
    this.setMaxCapacity = new SetMaxCapacity(this.env);
  }

  public start(): ResultAsync<void, Error> {
    return inquiryWrapper([
      {
        type: "list",
        name: "simulator",
        message: "Please select a course of action:",
        choices: [
          { name: "Create Campaign", value: "createCampaign" },
          { name: "Post Query", value: "postQuery" },
          { name: "Post Questionnaire Results", value: "postQuestionnaire" },
          { name: "Set Max Capacity", value: "setMaxCapacity" },
          new inquirer.Separator(),
          { name: "Cancel", value: "cancel" },
        ],
      },
    ]).andThen((answers) => {
      switch (answers.simulator) {
        case "createCampaign":
          return this.createCampaign.start();
        case "postQuery":
          return this.postQuery.start();
        case "postQuestionnaire":
          return this.postQuestionnaire.start();
        case "setMaxCapacity":
          return this.setMaxCapacity.start();
      }
      return okAsync(undefined);
    });
  }
}
