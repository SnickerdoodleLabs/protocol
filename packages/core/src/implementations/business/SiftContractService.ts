import { ISiftContractRepository } from "@core/interfaces/data/ISiftContractRepository";
import {
  IContractFactory,
  IContractFactoryType,
} from "@core/interfaces/utilities/factory";
import { ISiftContract } from "@contracts-sdk/interfaces/ISiftContract";

import {
  BlockchainProviderError,
  UninitializedError,
  SiftContractError,
  DomainName,
  TokenUri,
  EScamFilterStatus,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { ISiftContractService } from "@core/interfaces/business/ISiftContractService";

@injectable()
export class SiftContractService implements ISiftContractService {
  public constructor(
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

  maliciousURL(
    domain: DomainName,
  ): ResultAsync<
    void,
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
