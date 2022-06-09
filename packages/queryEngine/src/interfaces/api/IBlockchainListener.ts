import {
  BlockchainUnavailableError,
  ChainId,
  EthereumAccountAddress,
  EthereumContractAddress,
  IpfsCID,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IBlockchainListener {
  initialize(): ResultAsync<void, BlockchainUnavailableError>;
}

export const IBlockchainListenerType = Symbol.for("IBlockchainListener");
