import { ResultAsync } from "neverthrow";

import { SolanaNFT } from "@objects/businessObjects";
import { AccountNFTError, AjaxError } from "@objects/errors";
import { ChainId, SolanaAccountAddress } from "@objects/primitives";

export interface ISolanaNFTRepository {
  getTokensForAccount(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
  ): ResultAsync<SolanaNFT[], AccountNFTError | AjaxError>;
}
