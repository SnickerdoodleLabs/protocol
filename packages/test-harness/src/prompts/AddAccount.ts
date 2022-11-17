import { ResultAsync } from "neverthrow";

import { AjaxError, BlockchainProviderError, CrumbsContractError, InvalidSignatureError, MinimalForwarderContractError, PersistenceError, UninitializedError, UnsupportedLanguageError } from "@snickerdoodlelabs/objects";
import { inquiryWrapper } from "@test-harness/prompts/inquiryWrapper.js";
import { Prompt } from "@test-harness/prompts/Prompt.js";
import { TestWallet } from "@test-harness/utilities/index.js";

export class AddAccount extends Prompt {


    public start(): ResultAsync<
        void,
        | UnsupportedLanguageError
        | PersistenceError
        | AjaxError
        | BlockchainProviderError
        | UninitializedError
        | CrumbsContractError
        | InvalidSignatureError
        | MinimalForwarderContractError
    > {
        return this.core
            .getAccounts()
            .andThen((linkedAccounts) => {
                const addableAccounts = this.mocks.blockchain.accountWallets.filter((aw) => {
                    const linkedAccount = linkedAccounts.find((la) => {
                        return la.sourceAccountAddress == aw.accountAddress;
                    });
                    return linkedAccount == null;
                });
                return inquiryWrapper([
                    {
                        type: "list",
                        name: "addAccountSelector",
                        message: "Which account do you want to add?",
                        choices: addableAccounts.map((wallet) => {
                            return {
                                name: wallet.getName(),
                                value: wallet,
                            };
                        }),
                    },
                ]);
            })

            .andThen((answers) => {
                const wallet = answers.addAccountSelector as TestWallet;
                // Need to get the unlock message first
                return this.dataWalletProfile.getSignatureForAccount(wallet).andThen((signature) => {
                    return this.core.addAccount(
                        wallet.accountAddress,
                        signature,
                        this.mocks.languageCode,
                        wallet.chain,
                    );
                });
            })
            .mapErr((e) => {
                console.error(e);
                return e;
            });
    }
}