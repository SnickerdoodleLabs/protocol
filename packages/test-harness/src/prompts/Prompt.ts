import { ISnickerdoodleCore } from "@snickerdoodlelabs/objects";
import { Environment, TestHarnessMocks } from "@test-harness/mocks/index.js";
import { BusinessProfile, DataWalletProfile } from "@test-harness/utilities/index.js";
import { ResultAsync } from "neverthrow";

export abstract class Prompt {
    public constructor(
        public env: Environment
    ) {}

    public abstract start(): ResultAsync<void, Error>;

    public get core(): ISnickerdoodleCore { return this.env.core; }
    public get mocks(): TestHarnessMocks { return this.env.mocks; }
    public get dataWalletProfile(): DataWalletProfile { return this.env.dataWalletProfile; }
    public get businessProfile(): BusinessProfile { return this.env.businessProfile; }
}