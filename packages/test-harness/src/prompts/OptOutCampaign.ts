import {
  AjaxError,
  BlockchainProviderError,
  ConsentContractError,
  ConsentContractRepositoryError,
  Invitation,
  PageInvitation,
  PersistenceError,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import inquirer from "inquirer";
import { okAsync, ResultAsync } from "neverthrow";

import { inquiryWrapper } from "@test-harness/prompts/inquiryWrapper.js";
import { Prompt } from "@test-harness/prompts/Prompt.js";

export class OptOutCampaign extends Prompt {
  public start(): ResultAsync<
    void,
    | Error
    | PersistenceError
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | AjaxError
    | ConsentContractRepositoryError
  > {
    return this.core
      .getAcceptedInvitations()
      .andThen((invitations) => {
        console.log(invitations);
        if (invitations.length < 1) {
          console.log("No accepted invitations to opt out of!");
        }

        return inquiryWrapper([
          {
            type: "list",
            name: "optOutCampaign",
            message: "Please choose a campaign to opt out of:",
            choices: [
              ...invitations.map((invitation) => {
                return {
                  name: `${invitation.consentContractAddress}`,
                  value: invitation,
                };
              }),
              new inquirer.Separator(),
              { name: "Cancel", value: "cancel" },
            ],
          },
        ]);
      })
      .andThen((answers) => {
        if (answers.optOutCampaign == "cancel") {
          return okAsync(undefined);
        }
        const invitation = answers.optOutCampaign as Invitation;
        return this.core
          .leaveCohort(invitation.consentContractAddress)
          .map(() => {
            console.log(
              `Opted out of consent contract ${invitation.consentContractAddress}`,
            );

            // Remove it from the list of opted-in contracts
            const index = this.dataWalletProfile.acceptedInvitations.indexOf(
              invitation,
              0,
            );
            this.dataWalletProfile.acceptedInvitations.splice(index, 1);
          });
      })
      .mapErr((e) => {
        console.error(e);
        return e;
      });
  }
}
