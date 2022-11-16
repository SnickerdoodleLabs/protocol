import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { AjaxError, BlockchainProviderError, ConsentContractError, ConsentContractRepositoryError, EInvitationStatus, PageInvitation, PersistenceError, UninitializedError } from "@snickerdoodlelabs/objects";
import { inquiryWrapper } from "@test-harness/prompts/inquiryWrapper.js";
import { Prompt } from "@test-harness/prompts/Prompt.js";
import inquirer from "inquirer";

export class OptInCampaign extends Prompt {


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
            .getInvitationsByDomain(this.mocks.domainName)
            .andThen((invitations) => {
                return inquiryWrapper([
                    {
                        type: "list",
                        name: "optInCampaign",
                        message: "Please choose an invitation to accept:",
                        choices: [
                            ...invitations.map((invitation) => {
                                return {
                                    name: `${invitation.url}`,
                                    value: invitation,
                                };
                            }),
                            new inquirer.Separator(),
                            { name: "Cancel", value: "cancel" },
                        ],
                    },
                ]).andThen((answers) => {
                    if (answers.optInCampaign == "cancel") {
                        return okAsync(undefined);
                    }
                    const invitation = answers.optInCampaign as PageInvitation;

                    // Show the invitation details, like the popup would
                    console.log("Invitation details:", invitation.domainDetails);
                    return inquiryWrapper([
                        {
                            type: "list",
                            name: "acceptInvitation",
                            message: "Accept the invitation?",
                            choices: [
                                {
                                    name: "Yes",
                                    value: true,
                                },
                                {
                                    name: "No",
                                    value: false,
                                },
                            ],
                        },
                    ]).andThen((acceptAnswers) => {
                        
                        // You can reject the invitation
                        if (!acceptAnswers.acceptInvitation) {
                            return okAsync(undefined);
                        }

                        return this.core
                            .checkInvitationStatus(invitation.invitation)
                            .andThen((invitationStatus) => {
                                
                                if (invitationStatus != EInvitationStatus.New) {
            
                                    return errAsync(
                                        new Error(
                                            `Invalid invitation to campaign ${invitation.invitation.consentContractAddress}`,
                                        ),
                                    );
                                }
                                // Accept with no conditions
                                return this.core.acceptInvitation(invitation.invitation, null);
                            })
                            .map(() => {
                                console.log(
                                    `Accepted invitation to ${invitation.url}, with token Id ${invitation.invitation.tokenId}`,
                                );
                                this.dataWalletProfile.acceptedInvitations.push(invitation);
                                
                            })
                    });
                });
            })
            .mapErr((e) => {
                console.error(e);
                return e;
            });
    }
}