import { JsonRpcProvider } from "@ethersproject/providers";
import { BlockchainProviderError, EChain } from "@snickerdoodlelabs/objects";
import { ethers, Wallet } from "ethers";
import { ResultAsync } from "neverthrow";

export interface IBlockchainProvider {
  initialize(): ResultAsync<void, never>;

  // There is only a single signer that we will deal with, which uses the
  // derived DataWallet Key.
  getPrimarySigner(): ResultAsync<Wallet, BlockchainProviderError>;

  // The primary provider is required. A secondary provider is optional
  getPrimaryProvider(): ResultAsync<JsonRpcProvider, BlockchainProviderError>;
  getSecondaryProvider(): ResultAsync<
    JsonRpcProvider | null,
    BlockchainProviderError
  >;

  getLatestBlock(
    chain?: EChain,
  ): ResultAsync<ethers.providers.Block, BlockchainProviderError>;
}

export const IBlockchainProviderType = Symbol.for("IBlockchainProvider");
