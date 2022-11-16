import { ResultAsync } from "neverthrow";

import { ConsentContractError, ConsentFactoryContractError } from "@snickerdoodlelabs/objects";
import { Prompt } from "@test-harness/prompts/Prompt.js";

export class CreateCampaign extends Prompt {


    public start(): ResultAsync<
        void,
        ConsentFactoryContractError
        | ConsentContractError
        | Error
    > {
        return this.mocks.insightSimulator
            .createCampaign([
                this.mocks.domainName,
                this.mocks.domainName2,
                this.mocks.domainName3,
                this.mocks.domainName4
            ])
            .mapErr((e) => {
                console.error(e);
                return e;
            })
            .map((contractAddress) => {
                this.businessProfile.consentContracts.push(contractAddress);
            });
    }

}