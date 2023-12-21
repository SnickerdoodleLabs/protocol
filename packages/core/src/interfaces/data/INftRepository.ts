import {
  LinkedAccount,
  PersistenceError,
  EChain,
  UnixTimestamp,
  AccountIndexingError,
  AjaxError,
  InvalidParametersError,
  MethodSupportError,
  WalletNFT,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface INftRepository {
  /**
   * Retrieves latest nft data, if provided with benchmark, could also make new requests to indexers.
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

   * @returns Nft array
   */
  getNfts(
    benchmark?: UnixTimestamp,
    chains?: EChain[],
    accounts?: LinkedAccount[],
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
