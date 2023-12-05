import {
  LinkedAccount,
  PersistenceError,
  WalletNFT,
  EChain,
  WalletNFTHistory,
  WalletNftWithHistory,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface INftRepository {
  getCachedNFTs(
    chains?: EChain[],
    accounts?: LinkedAccount[],
  ): ResultAsync<WalletNFT[], PersistenceError>;
  getPersistenceNFTs(): ResultAsync<WalletNFT[], PersistenceError>;
  getNFTsHistory(): ResultAsync<WalletNFTHistory[], PersistenceError>;
  getCachedNftsWithHistory(
    chains?: EChain[],
    accounts?: LinkedAccount[],
  ): ResultAsync<WalletNftWithHistory[], PersistenceError>;
}

export const INftRepositoryType = Symbol.for("INftRepository");
