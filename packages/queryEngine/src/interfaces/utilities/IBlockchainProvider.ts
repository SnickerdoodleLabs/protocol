import {
  BlockchainProviderError,
  ChainId,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

export interface IBlockchainProvider {
  // There is only a single signer that we will deal with, which uses the
  // derived DataWallet Key.
  getDataWalletSigner(): ResultAsync<
    ethers.providers.JsonRpcSigner,
    BlockchainProviderError | UninitializedError
  >;

  // If no chain ID is given, it returns the provider for the DoodleChain
  getProvider(
    chainId?: ChainId,
  ): ResultAsync<ethers.providers.JsonRpcProvider, BlockchainProviderError>;
}

export const IBlockchainProviderType = Symbol.for("IBlockchainProvider");
