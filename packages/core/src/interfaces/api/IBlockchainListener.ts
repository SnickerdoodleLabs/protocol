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

  getAllQueryCIDs(
    contractAddresses: EVMContractAddress[],
    fromBlock?: BlockNumber,
    toBlock?: BlockNumber,
  ): ResultAsync<
    Map<EVMContractAddress, IpfsCID[]>,
    | BlockchainProviderError
    | UninitializedError
    | ConsentFactoryContractError
    | ConsentContractError
  >;
}

export const IBlockchainListenerType = Symbol.for("IBlockchainListener");
