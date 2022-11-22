import { ResultAsync } from "neverthrow";

import { AjaxError, BlockchainProviderError, CrumbsContractError, InvalidSignatureError, MinimalForwarderContractError, PersistenceError, UninitializedError, UnsupportedLanguageError } from "@snickerdoodlelabs/objects";
import { inquiryWrapper } from "@test-harness/prompts/inquiryWrapper.js";
import { Prompt } from "@test-harness/prompts/Prompt.js";
import { TestWallet } from "@test-harness/utilities/index.js";

export class UnlockCore extends Prompt {


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
                name: "unlockAccountSelector",
                message: "Which account do you want to unlock with?",
                choices: this.env.mocks.blockchain.accountWallets.map((wallet) => {
                    return {
                        name: wallet.getName(),
                        value: wallet,
                    };
                }),
            },
        ])
            .andThen((answers) => {
                const wallet = answers.unlockAccountSelector as TestWallet;
                // Need to get the unlock message first
                return this.env.dataWalletProfile.getSignatureForAccount(wallet).andThen((signature) => {
                    return this.core.unlock(
                        wallet.accountAddress,
                        signature,
                        this.env.mocks.languageCode,
                        wallet.chain,
                    );
                });
            })
            .map(() => {
                this.env.dataWalletProfile.unlock()
                console.log(`Unlocked!`);
            })
            .mapErr((e) => {
                console.error(e);
                return e;
            });
    }

}