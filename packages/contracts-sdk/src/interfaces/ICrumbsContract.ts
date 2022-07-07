import {
  EVMAccountAddress,
  CrumbsContractError,
  TokenId,
  TokenUri,
} from "@snickerdoodlelabs/objects";
import { EventFilter, Event } from "ethers";
import { ResultAsync } from "neverthrow";

import { ContractOverrides } from "@contracts-sdk/interfaces/objects/ContractOverrides";

export interface ICrumbsContract {
  /**
   * Gets the token id mapped to a particular account address, returns 0 if no such token exists
   * @param accountAddress the owner account address
   * @param contractOverrides for overriding transaction gas object
   */
  addressToCrumbId(
    accountAddress: EVMAccountAddress,
    contractOverrides?: ContractOverrides,
  ): ResultAsync<TokenUri | null, ConsentContractError>;
}

export const ICrumbsContractType = Symbol.for("ICrumbsContract");
