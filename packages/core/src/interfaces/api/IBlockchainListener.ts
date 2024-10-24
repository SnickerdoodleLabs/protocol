import {
  BlockchainProviderError,
  BlockNumber,
  ConsentContractError,
  ConsentFactoryContractError,
  EVMContractAddress,
  IpfsCID,
  PersistenceError,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IBlockchainListener {
  initialize(): ResultAsync<
    void,
    BlockchainProviderError | PersistenceError | UninitializedError
  >;
}

export const IBlockchainListenerType = Symbol.for("IBlockchainListener");
