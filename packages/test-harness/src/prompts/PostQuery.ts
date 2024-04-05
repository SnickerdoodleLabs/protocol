import {
  ConsentContractError,
  EVMContractAddress,
  IpfsCID,
  SDQLString,
} from "@snickerdoodlelabs/objects";
import inquirer from "inquirer";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { inquiryWrapper } from "@test-harness/prompts/inquiryWrapper.js";
import { Prompt } from "@test-harness/prompts/Prompt.js";

export class PostQuery extends Prompt {
  public start(
    ipfscid?: string,
  ): ResultAsync<void, Error | ConsentContractError> {
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
          // {
          //   name: `Query 1`,
          //   value: 1,
          // },
          {
            name: `Query 2`,
            value: 2,
          },
          {
            name: `Query 3 - Ads`,
            value: 3,
          },
          {
            name: `Query 4 - Ads`,
            value: 4,
          },
          {
            name: `Query 5 - Questionnaire`,
            value: 5,
          },
          new inquirer.Separator(),
          { name: "Cancel", value: "cancel" },
        ],
      },
    ])
      .andThen((answers) => {
        const contractAddress = EVMContractAddress(answers.consentContract);
        const queryId = answers.queryId;
        if (
          this.businessProfile.consentContracts.includes(contractAddress) &&
          queryId != "cancel"
        ) {
          // They did not pick "cancel"
          let queryText = SDQLString("");
          if (queryId === 1) {
            queryText = SDQLString(JSON.stringify(this.mocks.query1));
          } else if (queryId === 2) {
            if (ipfscid !== undefined) {
              this.mocks.query2.queries.q5.cid = ipfscid;
            }
            queryText = SDQLString(JSON.stringify(this.mocks.query2));
          } else if (queryId === 3) {
            queryText = SDQLString(JSON.stringify(this.mocks.query3));
          } else if (queryId === 4) {
            queryText = SDQLString(JSON.stringify(this.mocks.query4));
          } else if (queryId === 5) {
            queryText = SDQLString(JSON.stringify(this.mocks.query5));
          }
          return this.mocks.insightSimulator.postQuery(
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
