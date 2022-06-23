import {
  BlockchainProviderError,
  ChainId,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { JsonRpcSigner, JsonRpcProvider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

export interface IBlockchainProvider {
  initialize(): ResultAsync<void, UninitializedError>;

  // There is only a single signer that we will deal with, which uses the
  // derived DataWallet Key.
  getControlSigner(): ResultAsync<
    JsonRpcSigner,
    BlockchainProviderError | UninitializedError
  >;

  // If no chain ID is given, it returns the provider for the DoodleChain
  getProvider(
    chainId?: ChainId,
  ): ResultAsync<JsonRpcProvider, BlockchainProviderError | UninitializedError>;

  getControlProvider(): ResultAsync<
    JsonRpcProvider,
    BlockchainProviderError | UninitializedError
  >;

  /**
   * Returns a map of providers for all the chains we support to their chain ID.
   */
  getAllProviders(): ResultAsync<
    Map<ChainId, JsonRpcProvider>,
    UninitializedError
  >;

  getLatestBlock(
    chainId?: ChainId,
  ): ResultAsync<
    ethers.providers.Block,
    BlockchainProviderError | UninitializedError
  >;
}

export const IBlockchainProviderType = Symbol.for("IBlockchainProvider");
