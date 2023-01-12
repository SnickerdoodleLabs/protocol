import {
    EligibleAd
} from "@snickerdoodlelabs/objects";
import { inquiryWrapper } from "@test-harness/prompts/inquiryWrapper.js";
import { Prompt } from "@test-harness/prompts/Prompt.js";
import { ResultAsync } from "neverthrow";

export class SignStoredAds extends Prompt {

    public start(): ResultAsync<void,Error> {

        return this.core.getEligibleAds().andThen((storedAds) => {

            return inquiryWrapper([{
                type: "list",
                name: "signStoredAdsSelector",
                message: "Which ad would you like to sign and store?",
                choices: storedAds.map((ad) => {
                    return {
                        name: ad.name,
                        value: ad,
                    };
                })
            }]);
        }).andThen((answer) => {

            const selectedAd = answer.signStoredAdsSelector as EligibleAd;
            return this.core.onAdDisplayed(selectedAd);
        }).mapErr((e) => {
            console.error(e);
            return e;
        });
    }
}
