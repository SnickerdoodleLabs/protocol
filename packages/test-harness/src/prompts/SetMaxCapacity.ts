import {
  ConsentContractError,
  EVMContractAddress,
} from "@snickerdoodlelabs/objects";
import { inquiryWrapper } from "@test-harness/prompts/inquiryWrapper.js";
import { Prompt } from "@test-harness/prompts/Prompt.js";
import inquirer from "inquirer";
import { okAsync, ResultAsync } from "neverthrow";

export class SetMaxCapacity extends Prompt {
  public start(): ResultAsync<void, Error | ConsentContractError> {
    return inquiryWrapper([
      {
        type: "list",
        name: "consentContract",
        message: "Please select a consent contract to set the max capacity on:",
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
        type: "number",
        name: "maxCapacity",
        message: "Enter the new max capacity:",
      },
    ])
      .andThen((answers) => {
        const contractAddress = EVMContractAddress(answers.consentContract);
        const maxCapacity = Number(answers.maxCapacity);

        if (
          this.businessProfile.consentContracts.includes(contractAddress) &&
          answers.consentContract != "cancel"
        ) {
          // They did not pick "cancel"
          return this.mocks.blockchain.setConsentContractMaxCapacity(
            contractAddress,
            maxCapacity,
          );
        }

        return okAsync(undefined);
      })
      .mapErr((e) => {
        console.error(e);
        return e;
      })
      .map(() => {});
  }
}
