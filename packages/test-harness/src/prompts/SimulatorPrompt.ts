import inquirer from "inquirer";
import { okAsync, ResultAsync } from "neverthrow";

import { Environment } from "@test-harness/mocks/Environment.js";
import { CreateCampaign } from "@test-harness/prompts/CreateCampaign.js";
import { inquiryWrapper } from "@test-harness/prompts/inquiryWrapper.js";
import { PostQuery } from "@test-harness/prompts/PostQuery.js";
import { Prompt } from "@test-harness/prompts/Prompt.js";
import { SetMaxCapacity } from "@test-harness/prompts/SetMaxCapacity.js";
import { NewQuestionnaireAnswer } from "@snickerdoodlelabs/objects";

export class SimulatorPrompt extends Prompt {
  private createCampaign: CreateCampaign;
  private postQuery: PostQuery;
  private setMaxCapacity: SetMaxCapacity;

  public constructor(public env: Environment) {
    super(env);

    this.createCampaign = new CreateCampaign(this.env);
    this.postQuery = new PostQuery(this.env);
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
          { name: "Upload Questionnaire", value: "uploadQuestionnaire" },
          { name: "Post Query", value: "postQuery" },
          { name: "Set Max Capacity", value: "setMaxCapacity" },
          new inquirer.Separator(),
          { name: "Cancel", value: "cancel" },
        ],
      },
    ]).andThen((answers) => {
      switch (answers.simulator) {
        case "createCampaign":
          return this.createCampaign.start();
        case "uploadQuestionnaire":
          return this.mocks.insightSimulator.uploadQuestionnaire().map((cid) => {
            return this.mocks.blockchain.consentFactoryContract.getQuestionnaires().map((questionnaire) => {
              console.log("consent contract questionnaire: " + questionnaire);
                return this.env.core.questionnaire.answerQuestionnaire(cid, [
                  new NewQuestionnaireAnswer(cid, 0, 0)
                ], undefined).map(() => {
                  this.env.ipfsCid = cid;
                  console.log(`Questionnaire with cid ${cid} was successfully uploaded`);
                 })
              })
          }).map(() => {});
        case "postQuery":
          return this.postQuery.start(this.env.ipfsCid);
        case "setMaxCapacity":
          return this.setMaxCapacity.start();
      }
      return okAsync(undefined);
    });
  }
}
