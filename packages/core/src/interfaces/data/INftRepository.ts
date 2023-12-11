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
   * Retrieves NFT data from indexers and updates the IndexedDB and cache accordingly.
   * The Data from db is gathered through the cache, in essence cache is the aggregated wallet nfts with their histories
   * It will also updated cache itself rather than recrate it, after succcessfully creating the new
   * Index db records
   *
   * This method is called in 2 cases, either the poller wants to update the data
   * Or a query that is later than the our latest measurement date needs to be processed, as such we update our records
   *
   * Key Points:
   * - The primary data source is the indexers. The IndexedDB (nft, nftHistory) is updated along with the cache (which holds the latest merged data of sorted NFTs with NFT history).
   * - Indexers respond for specific blockchain chains, and any chain not included in the response won't be updated.
   *
   * For chains in the indexer response:
   *
   * - If the IndexedDB has records that are not included in our database, they are added along with their history.
   * - If the IndexedDB has records that the indexer does not have, "Removed" history is added with the current amount.
   *
   * If a record exists in both:
   *
   * - For ERC1155 NFTs, it checks for differences in amounts and adds appropriate history.
   * - For ERC721 NFTs, it checks if the last recorded amount is 0. In that case, it adds "Added" history (indicating the user had the NFT, transferred it, and got it back).
   *
   * These are made so that we can have a snapshot of a users nft holdings which we use on our queries, indexer nfts are used on our events
   *
   *
   * @param chain The blockchain chain (e.g., Ethereum, Solana), If not given supported chains will be used
   * @param accountAddress The user's account address, if not given linked account addressess will be used
   * @returns indexer response nfts
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
