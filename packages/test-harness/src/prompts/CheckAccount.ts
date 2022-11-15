import { okAsync, ResultAsync } from "neverthrow";

import inquirer from "inquirer";
import { Prompt } from "@test-harness/prompts/Prompt.js";
import { inquiryWrapper } from "@test-harness/prompts/inquiryWrapper.js";
import { AjaxError, BlockchainProviderError, CrumbsContractError, InvalidSignatureError, MinimalForwarderContractError, PersistenceError, UninitializedError, UnsupportedLanguageError } from "@snickerdoodlelabs/objects";
import { TestWallet } from "@test-harness/utilities/index.js";

export class CheckAccount extends Prompt {


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
        return inquiryWrapper([
            {
                type: "list",
                name: "checkAccountSelector",
                message: "Which account do you want to check?",
                choices: this.mocks.blockchain.accountWallets.map((wallet) => {
                    return {
                        name: wallet.getName(),
                        value: wallet,
                    };
                }),
            },
        ])
            .andThen((answers) => {
                const wallet = answers.checkAccountSelector as TestWallet;
                // Need to get the unlock message first
                return this.dataWalletProfile.getSignatureForAccount(wallet)
                    .andThen((signature) => {
                        console.log(wallet.accountAddress, signature, wallet.chain);
                        return this.core.getDataWalletForAccount(
                            wallet.accountAddress,
                            signature,
                            this.mocks.languageCode,
                            wallet.chain,
                        );
                    })
                    .map((dataWalletAccount) => {
                        console.log(
                            `Data wallet account address for account ${wallet.accountAddress}: ${dataWalletAccount}`,
                        );
                    });
            })
            .mapErr((e) => {
                console.error(e);
                return e;
            });
    }
}