import { JsonRpcSigner, JsonRpcProvider } from "@ethersproject/providers";
import { BlockchainProviderError, ChainId } from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

export interface IBlockchainProvider {
  initialize(): ResultAsync<void, never>;

  // There is only a single signer that we will deal with, which uses the
  // derived DataWallet Key.
  getControlSigner(): ResultAsync<JsonRpcSigner, BlockchainProviderError>;

  // If no chain ID is given, it returns the provider for the DoodleChain
  getProvider(
    chainId?: ChainId,
  ): ResultAsync<JsonRpcProvider, BlockchainProviderError>;

  getControlProvider(): ResultAsync<JsonRpcProvider, BlockchainProviderError>;

  /**
   * Returns a map of providers for all the chains we support to their chain ID.
   */
  getAllProviders(): ResultAsync<Map<ChainId, JsonRpcProvider>, never>;

  getLatestBlock(
    chainId?: ChainId,
  ): ResultAsync<ethers.providers.Block, BlockchainProviderError>;
}

export const IBlockchainProviderType = Symbol.for("IBlockchainProvider");
