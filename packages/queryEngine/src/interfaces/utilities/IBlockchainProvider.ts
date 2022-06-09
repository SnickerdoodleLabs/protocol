import {
  BlockchainUnavailableError,
  ChainId,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

export interface IBlockchainProvider {
  // These methods return signers/providers linked to the Control Chain
  getSigner(
    chainId?: ChainId,
  ): ResultAsync<ethers.providers.JsonRpcSigner, BlockchainUnavailableError>;
  getProvider(
    chainId?: ChainId,
  ): ResultAsync<ethers.providers.JsonRpcProvider, BlockchainUnavailableError>;
}

export const IBlockchainProviderType = Symbol.for("IBlockchainProvider");
