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

export const ISiftContractServiceType = Symbol.for("ISiftContractService");
