import {
  BlockchainProviderError,
  ChainId,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { JsonRpcSigner, Provider } from "@ethersproject/providers";
import { ResultAsync } from "neverthrow";

export interface IBlockchainProvider {
  initialize(): ResultAsync<void, never>;

  // There is only a single signer that we will deal with, which uses the
  // derived DataWallet Key.
  getDefaultSigner(): ResultAsync<
    JsonRpcSigner,
    BlockchainProviderError | UninitializedError
  >;

  // If no chain ID is given, it returns the provider for the DoodleChain
  getProvider(chainId?: ChainId): ResultAsync<Provider, never>;

  getDefaultProvider(): ResultAsync<Provider, never>;

  /**
   * Returns a map of providers for all the chains we support to their chain ID.
   */
  getAllProviders(): ResultAsync<Map<ChainId, Provider>, never>;
}

export const IBlockchainProviderType = Symbol.for("IBlockchainProvider");
