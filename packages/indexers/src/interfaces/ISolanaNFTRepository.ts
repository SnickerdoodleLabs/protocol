import {
  ChainId,
  SolanaAccountAddress,
  SolanaNFT,
  AccountIndexingError,
  AjaxError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ISolanaNFTRepository {
  getTokensForAccount(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
  ): ResultAsync<SolanaNFT[], AccountIndexingError | AjaxError>;
}
