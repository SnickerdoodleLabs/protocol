import { ISiftContractService } from "@core/interfaces/business/index.js";
import {
  ISiftContractRepository,
  ISiftContractRepositoryType,
} from "@core/interfaces/data/index.js";
import { WrappedTransactionResponse } from "@snickerdoodlelabs/contracts-sdk";
import {
  BlockchainProviderError,
  UninitializedError,
  SiftContractError,
  DomainName,
  EScamFilterStatus,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

@injectable()
export class SiftContractService implements ISiftContractService {
  public constructor(
    @inject(ISiftContractRepositoryType)
    protected siftContractRepository: ISiftContractRepository,
  ) {}

  verifyURL(
    domain: DomainName,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainProviderError | UninitializedError | SiftContractError
  > {
    return this.siftContractRepository.verifyURL(domain);
  }

  maliciousURL(
    domain: DomainName,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainProviderError | UninitializedError | SiftContractError
  > {
    return this.siftContractRepository.maliciousURL(domain);
  }

  checkURL(
    domain: DomainName,
  ): ResultAsync<
    EScamFilterStatus,
    BlockchainProviderError | UninitializedError | SiftContractError
  > {
    return this.siftContractRepository.checkURL(domain);
  }
}
