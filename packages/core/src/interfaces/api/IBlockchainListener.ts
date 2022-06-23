import {
  BlockchainProviderError,
  PersistenceError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IBlockchainListener {
  initialize(): ResultAsync<void, BlockchainProviderError | PersistenceError>;
}

export const IBlockchainListenerType = Symbol.for("IBlockchainListener");
