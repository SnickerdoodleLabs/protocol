import { okAsync, ResultAsync } from "neverthrow";

import { AjaxError, BlockchainProviderError, ConsentContractError, ConsentContractRepositoryError, PageInvitation, PersistenceError, UninitializedError } from "@snickerdoodlelabs/objects";
import { inquiryWrapper } from "@test-harness/prompts/inquiryWrapper.js";
import { Prompt } from "@test-harness/prompts/Prompt.js";
import inquirer from "inquirer";


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
        return inquiryWrapper([
            {
                type: "list",
                name: "optOutCampaign",
                message: "Please choose a campaign to opt out of:",
                choices: [
                    ...this.dataWalletProfile.acceptedInvitations.map((invitation) => {
                        return {
                            name: `${invitation.invitation.consentContractAddress}`,
                            value: invitation,
                        };
                    }),
                    new inquirer.Separator(),
                    { name: "Cancel", value: "cancel" },
                ],
            },
        ])
            .andThen((answers) => {
                if (answers.optOutCampaign == "cancel") {
                    return okAsync(undefined);
                }
                const invitation = answers.optOutCampaign as PageInvitation;
                return this.core
                    .leaveCohort(invitation.invitation.consentContractAddress)
                    .map(() => {
                        console.log(
                            `Opted out of consent contract ${invitation.invitation.consentContractAddress}`,
                        );

                        // Remove it from the list of opted-in contracts
                        const index = this.dataWalletProfile.acceptedInvitations.indexOf(invitation, 0);
                        this.dataWalletProfile.acceptedInvitations.splice(index, 1);
                    });
            })
            .mapErr((e) => {
                console.error(e);
                return e;
            });
    }
}