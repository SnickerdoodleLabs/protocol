import {
  SiftContractError,
  EVMAccountAddress,
  IpfsCID,
  TokenUri,
  Signature,
  ConsentToken,
  RequestForData,
  BlockNumber,
  DomainName,
  BaseURI,
  SiftEntity,
} from "@snickerdoodlelabs/objects";
import { EventFilter, Event } from "ethers";
import { ResultAsync } from "neverthrow";

import { ContractOverrides } from "@contracts-sdk/interfaces/objects/ContractOverrides";

export interface ISiftContract {
  /**
   * Verifies a URL
   * Marks the domain tokenURI value as VERIFIED
   * @param domain Domain name to verify
   */
  verifyEntity(domain: DomainName): ResultAsync<void, SiftContractError>;

  /**
   * Sets a URL as malicious
   * Marks the domain tokenURI value as MALICIOUS
   * @param domain Domain name to set as malicious
   */
  maliciousEntity(domain: DomainName): ResultAsync<void, SiftContractError>;

  /**
   * Checks a URL
   * Returns tokenURI or NOT VERIFIED
   * eg. 'www.sift.com/VERIFIED', 'www.sift.com/MALICIOUS' or 'NOT VERIFIED
   * @param domain Domain name to check
   */
  checkEntity(domain: DomainName): ResultAsync<string, SiftContractError>;

  /**
   * Sets a new base uri for the contract
   * @param baseUri New base uri
   */
  setBaseURI(baseUri: BaseURI): ResultAsync<void, SiftContractError>;
}

export const ISiftContractType = Symbol.for("ISiftContract");
