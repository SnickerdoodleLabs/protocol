import {
  BlockchainProviderError,
  SiftContractError,
  DomainName,
  UninitializedError,
  EScamFilterStatus,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ISiftContractRepository {
  verifyEntity(
    domain: DomainName,
  ): ResultAsync<
    void,
    BlockchainProviderError | UninitializedError | SiftContractError
  >;

  maliciousEntity(
    domain: DomainName,
  ): ResultAsync<
    void,
    BlockchainProviderError | UninitializedError | SiftContractError
  >;

  checkEntity(
    domain: DomainName,
  ): ResultAsync<
    EScamFilterStatus,
    BlockchainProviderError | UninitializedError | SiftContractError
  >;
}

export const ISiftContractRepositoryType = Symbol.for(
  "ISiftContractRepository",
);
