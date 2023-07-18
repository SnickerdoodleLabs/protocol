import { IBaseContract } from "@contracts-sdk/interfaces/IBaseContract.js";
import { ContractOverrides } from "@contracts-sdk/interfaces/objects/ContractOverrides";
import { WrappedTransactionResponse } from "@contracts-sdk/interfaces/objects/index.js";
import {
  SiftContractError,
  TokenUri,
  DomainName,
  BaseURI,
  BlockchainCommonErrors,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ISiftContract extends IBaseContract {
  /**
   * Verifies a URL
   * Marks the domain tokenURI value as VERIFIED
   * @param domain Domain name to verify
   */
  verifyURL(
    domain: DomainName,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SiftContractError
  >;

  /**
   * Sets a URL as malicious
   * Marks the domain tokenURI value as MALICIOUS
   * @param domain Domain name to set as malicious
   */
  maliciousURL(
    domain: DomainName,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SiftContractError
  >;

  /**
   * Checks a URL
   * Returns tokenURI or NOT VERIFIED
   * eg. 'www.sift.com/VERIFIED', 'www.sift.com/MALICIOUS' or 'NOT VERIFIED
   * @param domain Domain name to check
   */
  checkURL(
    domain: DomainName,
  ): ResultAsync<TokenUri, SiftContractError | BlockchainCommonErrors>;

  /**
   * Sets a new base uri for the contract
   * @param baseUri New base uri
   */
  setBaseURI(
    baseUri: BaseURI,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SiftContractError
  >;
}

export const ISiftContractType = Symbol.for("ISiftContract");
