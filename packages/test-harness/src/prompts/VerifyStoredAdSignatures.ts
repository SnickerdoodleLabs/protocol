import {
    AdSignature
} from "@snickerdoodlelabs/objects";
import { inquiryWrapper } from "@test-harness/prompts/inquiryWrapper.js";
import { Prompt } from "@test-harness/prompts/Prompt.js";
import { okAsync, ResultAsync } from "neverthrow";

export class VerifyStoredAdSignatures extends Prompt {

    public start(): ResultAsync<void,Error> {

        return this.core.getAdSignatures().andThen((adSignatures) => {

            return inquiryWrapper([{
                type: "list",
                name: "verifyAdSignaturesSelector",
                message: "Which ad signature would you like to verify?",
                choices: adSignatures.map((adSig) => {
                    return {
                        name: adSig.queryCID + " - " + adSig.adKey + " at " + adSig.consentContractAddress,
                        value: adSig,
                    };
                })
            }]);
        }).andThen((answer) => {

            const selectedSignature = answer.verifyAdSignaturesSelector as AdSignature;
            return this.env.insightPlatform.verifyAdSignature(
                this.env.adSignatureContentHashMap.get(
                    selectedSignature.queryCID + selectedSignature.adKey
                )!, selectedSignature
            ).andThen(() => {

                console.log("Ad signature is valid!!");
                return okAsync(undefined);
            });
        });
    }
}
  