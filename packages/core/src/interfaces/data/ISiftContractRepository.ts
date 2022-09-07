import {
  BlockchainProviderError,
  SiftContractError,
  DomainName,
  TokenUri,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ISiftContractRepository {
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
    TokenUri,
    BlockchainProviderError | UninitializedError | SiftContractError
  >;
}

export const ISiftContractRepositoryType = Symbol.for("ISiftContractRepository");