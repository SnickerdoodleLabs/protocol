import {
  LinkedAccount,
  PersistenceError,
  WalletNFT,
  EChain,
  WalletNFTHistory,
  WalletNftWithHistory,
  UnixTimestamp,
  AccountAddress,
  AccountIndexingError,
  AjaxError,
  InvalidParametersError,
  MethodSupportError,
  NftRepositoryCache,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface INftRepository {
  getCache(): ResultAsync<NftRepositoryCache, PersistenceError>;

  /**
   * Retrieves NFT data from the cache, updating the cache as necessary based on the provided benchmark.
   *
   * This method is designed to return NFT records up to a specified point in time, defined by the benchmark.
   * It ensures that the cache contains the most recent data by updating it if the last known measurement
   * date for any chain is earlier than the provided benchmark. This update involves fetching the latest data
   * from the indexers, updating the cache, and then using the updated cache
   *
   * Key Points:
   * - Primarily operates on cached NFT data rather than directly querying indexers.
   * - If the cache's last measurement date for a chain is before the benchmark, the cache is updated to include
   *   the latest data up to the benchmark date.
   * - The method returns NFTs with their historical data, providing a snapshot of NFT holdings up to the benchmark.
   *
   * Usage:
   * - Can be used for debugging
   * - Can be used to respond to queries
   *
   * @param benchmark Optional UnixTimestamp representing the point in time up to which records are needed.
   *                  If not provided, current data in the cache is used. Queries will use this with benchmark
   * @param chains Optional array of `EChain`.  Optional array of `EChain`. If not provided, all supported chains will be used.
   * @param accounts  Optional array of `LinkedAccount`. If not provided, all the linked accounts will be used.

   * @returns WalletNftWithHistory array
   */
  getCachedNFTs(
    benchmark?: UnixTimestamp,
    chains?: EChain[],
    accounts?: LinkedAccount[],
  ): ResultAsync<
    WalletNftWithHistory[],
    | PersistenceError
    | AccountIndexingError
    | AjaxError
    | MethodSupportError
    | InvalidParametersError
  >;

  getPersistenceNFTs(): ResultAsync<WalletNFT[], PersistenceError>;
  getNFTsHistory(): ResultAsync<WalletNFTHistory[], PersistenceError>;

  /**
   * Updates the IndexedDB and cache with NFT data retrieved from indexers.
   *
   * This method serves two primary purposes:
   * 1. To regularly update data based on polling.
   * 2. To process queries that require recent data, ensuring records are up-to-date.
   *
   * Overview:
   * - Utilizes data from indexers as the primary source for NFT information.
   * - Updates both the IndexedDB (storing individual NFT and NFT history records) and an in-memory cache
   *   (aggregating the latest comprehensive NFT data with their historical records).
   * - Handles data for specified blockchain chains; chains not in the indexer's response are not updated.
   *
   * Processing Logic:
   * - New NFT records not present in the database are added to IndexedDB and cache, along with their history.
   * - NFT records present in the database but missing from the indexer's response are added with "Removed" to history.
   * - For each NFT found in both sources:
   *   - For ERC1155 NFTs, differences in amounts are identified, and history records are updated accordingly.
   *   - For ERC721 NFTs, if the last recorded amount is 0, an "Added" history record is created.(User transferred the nft, then got it back again)
   *
   * The method ensures an accurate snapshot of user NFT holdings is maintained for querying purposes,
   * while indexer data is used to trigger events.
   *
   * @param accounts Optional array of `LinkedAccount`. If not provided, all the linked accounts will be used.
   * @param chain Optional array of `EChain`. If not provided, all supported chains will be used.
   * @returns indexer nft responses, used for events
   */
  getIndexerNftsAndUpdateIndexedDb(
    accounts?: LinkedAccount[],
    chain?: EChain[],
  ): ResultAsync<
    WalletNFT[],
    | PersistenceError
    | AccountIndexingError
    | AjaxError
    | MethodSupportError
    | InvalidParametersError
  >;
}

export const INftRepositoryType = Symbol.for("INftRepository");
