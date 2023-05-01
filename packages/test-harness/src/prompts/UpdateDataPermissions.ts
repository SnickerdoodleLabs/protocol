import {
  AjaxError,
  BlockchainProviderError,
  ConsentContractError,
  ConsentContractRepositoryError,
  DataPermissions,
  EVMContractAddress,
  EWalletDataType,
  PersistenceError,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import inquirer from "inquirer";
import { okAsync, ResultAsync } from "neverthrow";

import { inquiryWrapper } from "@test-harness/prompts/inquiryWrapper.js";
import { Prompt } from "@test-harness/prompts/Prompt.js";

export class UpdateDataPermissions extends Prompt {
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
        return inquiryWrapper([
          {
            type: "list",
            name: "chooseInvitation",
            message: "Choose a consent contract to alter permissions on",
            choices: [
              ...invitations.map((invitation) => {
                return {
                  name: invitation.consentContractAddress,
                  value: invitation.consentContractAddress,
                };
              }),
              new inquirer.Separator(),
              { name: "Cancel", value: "cancel" },
            ],
          },
        ]).andThen((answers) => {
          if (answers.chooseInvitation == "cancel") {
            return okAsync(undefined);
          }
          const consentContractAddress =
            answers.chooseInvitation as EVMContractAddress;

          // Show the invitation details, like the popup would
          return inquiryWrapper([
            {
              type: "list",
              name: "updateDataPermissions",
              message: "Please choose permissions:",
              choices: [
                { name: "All Permissions", value: "all" },
                { name: "Some Permissions", value: "some" },
                { name: "No Permissions", value: "none" },
                new inquirer.Separator(),
                { name: "Cancel", value: "cancel" },
              ],
            },
          ]).andThen((whichPermissionsAnswers) => {
            // You can reject the invitation
            if (whichPermissionsAnswers.updateDataPermissions == "cancel") {
              return okAsync(undefined);
            }

            let permissions: DataPermissions;
            if (whichPermissionsAnswers.updateDataPermissions == "all") {
              permissions = DataPermissions.createWithAllPermissions();
            } else if (
              whichPermissionsAnswers.updateDataPermissions == "some"
            ) {
              permissions = DataPermissions.createWithPermissions([
                EWalletDataType.AccountBalances,
              ]);
            } else {
              permissions = DataPermissions.createWithPermissions([]);
            }

            return this.core
              .updateDataPermissions(consentContractAddress, permissions)
              .map(() => {
                console.log(
                  `Updated data permissions on ${consentContractAddress}`,
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
