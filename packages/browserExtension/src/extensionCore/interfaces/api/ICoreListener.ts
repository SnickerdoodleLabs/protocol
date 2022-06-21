import {
  DataWalletAddress,
  EthereumAccountAddress,
  SDQLQuery,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ICoreListener {
  initialize(): ResultAsync<void, never>;
  onInitialized(dataWalletAddress: DataWalletAddress): ResultAsync<void, never>;
  onAccountAdded(account: EthereumAccountAddress): ResultAsync<void, never>;
  onQueryPosted(query: SDQLQuery): ResultAsync<void, never>;
}
