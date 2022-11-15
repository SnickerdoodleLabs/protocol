import { Environment } from "@test-harness/mocks/Environment";
import { ResultAsync } from "neverthrow";

export abstract class Prompt {
    public constructor(
        public env: Environment
    ) {}

    public abstract start(): ResultAsync<void, Error>;
}