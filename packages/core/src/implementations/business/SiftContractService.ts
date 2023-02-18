import {
  BlockchainProviderError,
  UninitializedError,
  SiftContractError,
  DomainName,
  EScamFilterStatus,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { ISiftContractService } from "@core/interfaces/business/index.js";
import {
  ISiftContractRepository,
  ISiftContractRepositoryType,
} from "@core/interfaces/data/index.js";

@injectable()
export class SiftContractService implements ISiftContractService {
  public constructor(
    @inject(ISiftContractRepositoryType)
    protected siftContractRepository: ISiftContractRepository,
  ) {}

  verifyURL(
    domain: DomainName,
  ): ResultAsync<
    void,
    BlockchainProviderError | UninitializedError | SiftContractError
  > {
    return this.siftContractRepository.verifyURL(domain);
  }

  maliciousEntity(
    domain: DomainName,
  ): ResultAsync<
    void,
    BlockchainProviderError | UninitializedError | SiftContractError
  > {
    return this.siftContractRepository.maliciousEntity(domain);
  }

  checkEntity(
    domain: DomainName,
  ): ResultAsync<
    EScamFilterStatus,
    BlockchainProviderError | UninitializedError | SiftContractError
  > {
    return this.siftContractRepository.checkEntity(domain);
  }
}
