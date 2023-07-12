import { WrappedTransactionResponse } from "@snickerdoodlelabs/contracts-sdk";
import {
  BlockchainProviderError,
  SiftContractError,
  DomainName,
  UninitializedError,
  EScamFilterStatus,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ISiftContractRepository {
  verifyURL(
    domain: DomainName,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainProviderError | UninitializedError | SiftContractError
  >;

  maliciousURL(
    domain: DomainName,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainProviderError | UninitializedError | SiftContractError
  >;

  checkURL(
    domain: DomainName,
  ): ResultAsync<
    EScamFilterStatus,
    BlockchainProviderError | UninitializedError | SiftContractError
  >;
}

export const ISiftContractRepositoryType = Symbol.for(
  "ISiftContractRepository",
);
