import { IBlockchainListener } from "@query-engine/interfaces/api";
import { ResultAsync } from "neverthrow";

export class BlockchainListener implements IBlockchainListener {
    public initialize(): ResultAsync<void, never> {
        throw new Error("Method not implemented.");
    }

}