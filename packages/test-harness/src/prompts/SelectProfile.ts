import { okAsync, ResultAsync } from "neverthrow";

import { AjaxError, BlockchainProviderError, CrumbsContractError, InvalidSignatureError, MinimalForwarderContractError, PersistenceError, UninitializedError, UnsupportedLanguageError } from "@snickerdoodlelabs/objects";
import { inquiryWrapper } from "@test-harness/prompts/inquiryWrapper.js";
import { DataWalletPrompt } from "@test-harness/prompts/DataWalletPrompt.js";
import { TestWallet } from "@test-harness/utilities/index.js";

export class SelectProfile extends DataWalletPrompt {


    public start(): ResultAsync<
        void,
        | Error
    > {

        return this.env.getDataWalletProfiles()
            .andThen((profiles) => {
                // return okAsync(undefined);
                
                return inquiryWrapper([
                    {
                        type: "list",
                        name: "walletProfileSelector",
                        message: "Which profile do you want to load?",
                        choices: profiles.map((pathInfo) => {
                            return {
                                name: pathInfo.name,
                                value: pathInfo
                            }
                        })
                    },
                ])
            })
            .andThen((answers) => {
                const pathInfo = answers.walletProfileSelector as {name: string, path: string};

                // steps
                // 1. replace core as unlock cannot be called twice. but we need to detach event handlers from the previous core
                // 2. create a new core
                // 3. initialize core
                
                this.env.loadDataWalletProfile(pathInfo); // we cannot return this promise as it's halted till core is unlocked.
                return okAsync(undefined)
            })
            .map(() => {
                console.log(`profile loaded`);
            })
            .mapErr((e) => {
                console.error(e);
                return e;
            });
            

    }

}