import { ResultAsync } from "neverthrow";

import { IEVMNFT } from "@objects/businessObjects";
import { AccountNFTError, AjaxError } from "@objects/errors";
import { ChainId, EVMAccountAddress } from "@objects/primitives";

export interface IEVMNftRepository {
  getTokensForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<IEVMNFT[], AccountNFTError | AjaxError>;
}
