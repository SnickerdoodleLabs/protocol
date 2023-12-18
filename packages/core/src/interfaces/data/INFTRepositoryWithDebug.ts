import {
  PersistenceError,
  WalletNFTData,
  WalletNFTHistory,
  NftRepositoryCache,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { INftRepository } from "@core/interfaces/data/INftRepository.js";

export interface INFTRepositoryWithDebug extends INftRepository {
  getNFTCache(): ResultAsync<NftRepositoryCache, PersistenceError>;
  getPersistenceNFTs(): ResultAsync<WalletNFTData[], PersistenceError>;
  getNFTsHistory(): ResultAsync<WalletNFTHistory[], PersistenceError>;
}

export const INFTRepositoryWithDebugType = Symbol.for(
  "INFTRepositoryWithDebug",
);
