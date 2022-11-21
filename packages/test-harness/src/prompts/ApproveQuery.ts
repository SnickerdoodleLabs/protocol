import { okAsync, ResultAsync } from "neverthrow";

import { SDQLQueryRequest } from "@snickerdoodlelabs/objects";
import { Environment } from "@test-harness/mocks/index.js";
import { inquiryWrapper } from "@test-harness/prompts/inquiryWrapper.js";
import { Prompt } from "@test-harness/prompts/Prompt.js";

export class ApproveQuery extends Prompt {
    public constructor(
        public env: Environment,
        protected queryRequest: SDQLQueryRequest
    ) {
        super(env);
    }


    public start(): ResultAsync<void, Error> {
        return inquiryWrapper([
            {
                type: "list",
                name: "approveQuery",
                message: "Approve running the query?",
                choices: [
                    { name: "Yes", value: true },
                    { name: "No", value: false },
                ],
            },
        ])
        .andThen((answers) => {
            if (!answers.approveQuery) {
                return okAsync(undefined);
            }

            return this.core.processQuery(
                this.queryRequest.consentContractAddress,
                this.queryRequest.query,
            );
        })
        .mapErr((e) => {
            console.error(e);
            return e;
        });
    }

}