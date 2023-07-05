import { IBaseContract } from "@contracts-sdk/interfaces/IBaseContract.js";
import { ContractOverrides } from "@contracts-sdk/interfaces/objects/ContractOverrides";
import {
  SiftContractError,
  TokenUri,
  DomainName,
  BaseURI,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { WrappedTransactionResponse } from "@contracts-sdk/interfaces/objects/index.js";

export interface ISiftContract extends IBaseContract {
  /**
   * Verifies a URL
   * Marks the domain tokenURI value as VERIFIED
   * @param domain Domain name to verify
   */
  verifyURL(
    domain: DomainName,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, SiftContractError>;

  /**
   * Sets a URL as malicious
   * Marks the domain tokenURI value as MALICIOUS
   * @param domain Domain name to set as malicious
   */
  maliciousURL(
    domain: DomainName,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, SiftContractError>;

  /**
   * Checks a URL
   * Returns tokenURI or NOT VERIFIED
   * eg. 'www.sift.com/VERIFIED', 'www.sift.com/MALICIOUS' or 'NOT VERIFIED
   * @param domain Domain name to check
   */
  checkURL(domain: DomainName): ResultAsync<TokenUri, SiftContractError>;

  /**
   * Sets a new base uri for the contract
   * @param baseUri New base uri
   */
  setBaseURI(
    baseUri: BaseURI,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, SiftContractError>;
}

export const ISiftContractType = Symbol.for("ISiftContract");
