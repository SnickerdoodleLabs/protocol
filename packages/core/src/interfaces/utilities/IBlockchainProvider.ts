import { JsonRpcProvider } from "@ethersproject/providers";
import { BlockchainProviderError, ChainId } from "@snickerdoodlelabs/objects";
import { ethers, Wallet } from "ethers";
import { ResultAsync } from "neverthrow";

export interface IBlockchainProvider {
  initialize(): ResultAsync<void, never>;

  // There is only a single signer that we will deal with, which uses the
  // derived DataWallet Key.
  getPrimarySigner(): ResultAsync<Wallet, BlockchainProviderError>;

  // 
  getPrimaryProvider(): ResultAsync<JsonRpcProvider, BlockchainProviderError>;
  getSecondaryProvider(): ResultAsync<
    JsonRpcProvider | null,
    BlockchainProviderError
  >;

  getLatestBlock(
    chainId?: ChainId,
  ): ResultAsync<ethers.providers.Block, BlockchainProviderError>;
}

export const IBlockchainProviderType = Symbol.for("IBlockchainProvider");
