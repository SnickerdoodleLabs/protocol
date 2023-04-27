import { ITimeUtils } from "@snickerdoodlelabs/common-utils";
import {
  AjaxError,
  BlockchainProviderError,
  ConsentContractError,
  ConsentContractRepositoryError,
  EInvitationStatus,
  PageInvitation,
  PersistenceError,
  UninitializedError,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import inquirer from "inquirer";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { Environment } from "@test-harness/mocks/index.js";
import { inquiryWrapper } from "@test-harness/prompts/inquiryWrapper.js";
import { Prompt } from "@test-harness/prompts/Prompt.js";

export class OptInCampaign extends Prompt {
  public constructor(
    environment: Environment,
    protected timeUtils: ITimeUtils,
  ) {
    super(environment);
  }

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
    return this.core.invitation
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
                  value: "yes",
                },
                {
                  name: "No",
                  value: "no",
                },
                {
                  name: "Reject",
                  value: "reject",
                },
                {
                  name: "Reject for 30 seconds",
                  value: "reject30",
                },
              ],
            },
          ]).andThen((acceptAnswers) => {
            // You can reject the invitation without rejecting it
            if (acceptAnswers.acceptInvitation == "no") {
              return okAsync(undefined);
            }

            if (acceptAnswers.acceptInvitation == "reject") {
              return this.core.invitation
                .rejectInvitation(invitation.invitation)
                .map(() => {
                  console.log(
                    `Rejected invitation to ${invitation.invitation.consentContractAddress} permanently`,
                  );
                });
            }

            if (acceptAnswers.acceptInvitation == "reject30") {
              // Calculate a time 30s in the future
              const rejectUntil = UnixTimestamp(
                this.timeUtils.getUnixNow() + 30,
              );
              return this.core.invitation
                .rejectInvitation(invitation.invitation, rejectUntil)
                .map(() => {
                  console.log(
                    `Rejected invitation to ${invitation.invitation.consentContractAddress} until ${rejectUntil}`,
                  );
                  setTimeout(() => {
                    console.log(
                      `Rejected invitation to ${invitation.invitation.consentContractAddress} should be available again`,
                    );
                  }, 30 * 1000);
                });
            }

            return this.core.invitation
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
                return this.core.invitation.acceptInvitation(
                  invitation.invitation,
                  null,
                );
              })
              .map(() => {
                console.log(
                  `Accepted invitation to ${invitation.url}, with token Id ${invitation.invitation.tokenId}`,
                );
              });
          });
        });
      })
      .mapErr((e) => {
        console.error(e);
        return e;
      });
  }
}
