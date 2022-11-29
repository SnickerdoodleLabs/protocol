import { Prompt } from "@test-harness/prompts/Prompt.js";
import { DataWalletProfile } from "@test-harness/utilities/DataWalletProfile.js";

export abstract class DataWalletPrompt extends Prompt {
    public get profile(): DataWalletProfile {
        return this.dataWalletProfile;
    }
}