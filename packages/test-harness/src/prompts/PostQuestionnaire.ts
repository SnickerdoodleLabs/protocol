import {
    ConsentContractError,
    EVMContractAddress,
    SDQLString,
  } from "@snickerdoodlelabs/objects";
  import inquirer from "inquirer";
  import { okAsync, ResultAsync } from "neverthrow";
  
  import { inquiryWrapper } from "@test-harness/prompts/inquiryWrapper.js";
  import { Prompt } from "@test-harness/prompts/Prompt.js";
  
  export class PostQuestionnaire extends Prompt {
    public start(): ResultAsync<void, Error | ConsentContractError> {
      return inquiryWrapper([
        {
          type: "list",
          name: "consentContract",
          message: "Please select a consent contract to post questionnaire data to:",
          choices: [
            ...this.businessProfile.consentContracts.map((contractAddress) => {
              return {
                name: `Consent Contract ${contractAddress}`,
                value: contractAddress,
              };
            }),
            new inquirer.Separator(),
            { name: "Cancel", value: "cancel" },
          ],
        },
        {
          type: "list",
          name: "questionnnaireId",
          message: "Please select which questionnaire to accept:",
          choices: [
            {
              name: `Questionnaire 1`,
              value: 1,
            },
            new inquirer.Separator(),
            { name: "Cancel", value: "cancel" },
          ],
        },
      ])
        .andThen((answers) => {
          const questionnnaireId = answers.questionnnaireId;
          const contractAddress = EVMContractAddress(answers.consentContract);

          if (
            this.businessProfile.consentContracts.includes(contractAddress) &&
            questionnnaireId != "cancel"
          ) {
            // They did not pick "cancel"
            let queryText = SDQLString("");
            if (questionnnaireId === 1) {
                queryText = SDQLString(JSON.stringify(this.mocks.query5));
            }

            return this.mocks.insightSimulator.postQuestionnaire(
              contractAddress,
              queryText,
            );
          }
  
          return okAsync(undefined);
        })
        .mapErr((e) => {
          console.error(e);
          return e;
        });
    }
  }