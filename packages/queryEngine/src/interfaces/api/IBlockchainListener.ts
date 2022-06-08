import { ResultAsync } from "neverthrow";
import { BlockchainUnavailableError, ChainId, EthereumAccountAddress, EthereumContractAddress, IpfsCID } from "@snickerdoodlelabs/objects";

export interface IBlockchainListener {
    initialize(): ResultAsync<void, BlockchainUnavailableError>;
}

export const IBlockchainListenerType = Symbol.for("IBlockchainListener");