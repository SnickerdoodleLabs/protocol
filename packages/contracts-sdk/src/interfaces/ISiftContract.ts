import {
  SiftContractError,
  TokenUri,
  DomainName,
  BaseURI,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { IBaseContract } from "@contracts-sdk/interfaces/IBaseContract.js";

export interface ISiftContract extends IBaseContract {
  /**
   * Verifies a URL
   * Marks the domain tokenURI value as VERIFIED
   * @param domain Domain name to verify
   */
  verifyURL(domain: DomainName): ResultAsync<void, SiftContractError>;

  /**
   * Sets a URL as malicious
   * Marks the domain tokenURI value as MALICIOUS
   * @param domain Domain name to set as malicious
   */
  maliciousURL(domain: DomainName): ResultAsync<void, SiftContractError>;

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
  setBaseURI(baseUri: BaseURI): ResultAsync<void, SiftContractError>;
}

export const ISiftContractType = Symbol.for("ISiftContract");
