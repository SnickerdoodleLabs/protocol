import { BlockchainProviderError, EChain } from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

export interface IBlockchainProvider {
  initialize(): ResultAsync<void, never>;

  // There is only a single signer that we will deal with, which uses the
  // derived DataWallet Key.
  getPrimarySigner(): ResultAsync<ethers.Wallet, BlockchainProviderError>;

  // The primary provider is required. A secondary provider is optional
  getPrimaryProvider(): ResultAsync<
    ethers.JsonRpcProvider,
    BlockchainProviderError
  >;
  getSecondaryProvider(): ResultAsync<
    ethers.JsonRpcProvider | null,
    BlockchainProviderError
  >;

  getLatestBlock(
    chain?: EChain,
  ): ResultAsync<ethers.Block, BlockchainProviderError>;
}

export const IBlockchainProviderType = Symbol.for("IBlockchainProvider");
