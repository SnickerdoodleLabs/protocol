import { ResultAsync } from "neverthrow";

export interface IBlockchainListener {
    initialize(): ResultAsync<void, never>;
}

export const IBlockchainListenerType = Symbol.for("IBlockchainListener");