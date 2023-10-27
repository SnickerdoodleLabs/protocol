import {
  ChainInformation,
  EVMAccountAddress,
  ProviderRpcError,
  Signature,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IBlockchainProviderRepository {
  getSignature(message: string): ResultAsync<Signature, ProviderRpcError>;
  getCurrentAccount(): ResultAsync<EVMAccountAddress | null, ProviderRpcError>;
  getCurrentChain(): ResultAsync<ChainInformation | null, ProviderRpcError>;
}

export const IBlockchainProviderRepositoryType = Symbol.for(
  "IBlockchainProviderRepository",
);
