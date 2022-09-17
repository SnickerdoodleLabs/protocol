import {
  BlockchainProviderError,
  SiftContractError,
  DomainName,
  TokenUri,
  UninitializedError,
  EScamFilterStatus,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ISiftContractService {
  verifyURL(
    domain: DomainName,
  ): ResultAsync<
    void,
    BlockchainProviderError | UninitializedError | SiftContractError
  >;

  maliciousURL(
    domain: DomainName,
  ): ResultAsync<
    void,
    BlockchainProviderError | UninitializedError | SiftContractError
  >;

  checkURL(
    domain: DomainName,
  ): ResultAsync<
    EScamFilterStatus,
    BlockchainProviderError | UninitializedError | SiftContractError
  >;
}

export const ISiftContractServiceType = Symbol.for("ISiftContractService");
