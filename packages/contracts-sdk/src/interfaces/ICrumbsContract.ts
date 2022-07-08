import {
  ConsentContractError,
  EVMAccountAddress,
  IpfsCID,
  TokenIdNumber,
  TokenUri,
  Signature,
  ConsentToken,
  RequestForData,
  BlockNumber,
} from "@snickerdoodlelabs/objects";
import { EventFilter, Event } from "ethers";
import { ResultAsync } from "neverthrow";

import { ContractOverrides } from "@contracts-sdk/interfaces/objects/ContractOverrides";

export interface ICrumbsContract {
  /**
   * Gets the token URI value for the crumb owned by a particular account address, or null if no such crumb exists
   * @param accountAddress the owner account address
   * @param contractOverrides for overriding transaction gas object
   */
  getCrumb(
    accountAddress: EVMAccountAddress,
    contractOverrides?: ContractOverrides,
  ): ResultAsync<TokenUri | null, ConsentContractError>;

  getCrumb(
    accountAddress: EVMAccountAddress,
    contractOverrides?: ContractOverrides,
  ): ResultAsync<TokenUri | null, ConsentContractError>;
}

export const ICrumbsContractType = Symbol.for("ICrumbsContract");
