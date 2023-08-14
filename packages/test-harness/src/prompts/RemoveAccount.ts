import {
  BlockchainProviderError,
  CrumbsContractError,
  EVMAccountAddress,
  PersistenceError,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import inquirer from "inquirer";
import { okAsync, ResultAsync } from "neverthrow";

import { inquiryWrapper } from "@test-harness/prompts/inquiryWrapper.js";
import { Prompt } from "@test-harness/prompts/Prompt.js";
import { TestWallet } from "@test-harness/utilities/index.js";

export class RemoveAccount extends Prompt {
  public start(): ResultAsync<
    void,
    | PersistenceError
    | BlockchainProviderError
    | UninitializedError
    | CrumbsContractError
    | Error
  > {
    return this.core
      .getAccounts()
      .andThen((linkedAccounts) => {
        const removeableWallets = this.mocks.blockchain.accountWallets.filter(
          (aw) => {
            const linkedAccount = linkedAccounts.find((la) => {
              return (
                la.sourceAccountAddress == EVMAccountAddress(aw.accountAddress)
              );
            });
            return linkedAccount != null;
          },
        );
        return inquiryWrapper([
          {
            type: "list",
            name: "removeAccountSelector",
            message: "Which account do you want to remove?",
            choices: [
              ...removeableWallets.map((wallet) => {
                return {
                  name: wallet.getName(),
                  value: wallet,
                };
              }),
              new inquirer.Separator(),
              { name: "Cancel", value: "cancel" },
            ],
          },
        ]);
      })
      .andThen((answers) => {
        if (answers.removeAccountSelector == "cancel") {
          return okAsync(undefined);
        }

        const wallet = answers.removeAccountSelector as TestWallet;

        return this.core.account
          .unlinkAccount(wallet.accountAddress, wallet.chain)
          .map(() => {
            console.log(`Unlinked account ${wallet.getName()}`);
          });
      })
      .mapErr((e) => {
        console.error(e);
        return e;
      });
  }
}
