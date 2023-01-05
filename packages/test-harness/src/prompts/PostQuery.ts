import { okAsync, ResultAsync } from "neverthrow";

import { ConsentContractError, EVMContractAddress, SDQLString } from "@snickerdoodlelabs/objects";
import { inquiryWrapper } from "@test-harness/prompts/inquiryWrapper.js";
import { Prompt } from "@test-harness/prompts/Prompt.js";
import inquirer from "inquirer";

export class PostQuery extends Prompt {


    public start(): ResultAsync<void, Error | ConsentContractError> {
        return inquiryWrapper([
          {
            type: "list",
            name: "consentContract",
            message: "Please select a consent contract to post a query to:",
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
            name: "queryId",
            message: "Please select which query to post:",
            choices: [
              {
                name: `Query 1`,
                value: 1,
              },
              {
                name: `Query 2`,
                value: 2,
              },
              {
                name: `Query 3 - Ads`,
                value: 3,
              },
              new inquirer.Separator(),
              { name: "Cancel", value: "cancel" },
            ],
          },
        ])
          .andThen((answers) => {
            const contractAddress = EVMContractAddress(answers.consentContract);
            const queryId = answers.queryId;
            if (this.businessProfile.consentContracts.includes(contractAddress) && queryId != "cancel") {
              // They did not pick "cancel"
              let queryText = SDQLString("");
              if (queryId === 1) {
                queryText = SDQLString(JSON.stringify(this.mocks.query1));
              } else if (queryId === 2) {
                queryText = SDQLString(JSON.stringify(this.mocks.query2));
            }  else if (queryId === 3) {
                queryText = SDQLString(JSON.stringify(this.mocks.query3));
              }
      
              return this.mocks.insightSimulator.postQuery(contractAddress, queryText);
            }
      
            return okAsync(undefined);
          })
          .mapErr((e) => {
            console.error(e);
            return e;
          });
    }

}