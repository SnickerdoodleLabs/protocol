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
                        choices: profiles.map((profile) => {
                            return {
                                name: profile.name,
                                value: profile
                            }
                        })
                    },
                ])
            })
            .andThen((answers) => {
                const profile = answers.walletProfileSelector as {name: string, path: string};
                return this.env.loadDataWalletProfile(profile);
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