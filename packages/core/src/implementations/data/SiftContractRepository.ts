import { ISiftContract } from "@snickerdoodlelabs/contracts-sdk";
import {
  BlockchainProviderError,
  UninitializedError,
  SiftContractError,
  DomainName,
  EScamFilterStatus,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { ISiftContractRepository } from "@core/interfaces/data/index.js";
import {
  IContractFactory,
  IContractFactoryType,
} from "@core/interfaces/utilities/factory/index.js";

@injectable()
export class SiftContractRepository implements ISiftContractRepository {
  protected siftContract: ResultAsync<
    ISiftContract,
    BlockchainProviderError | UninitializedError
  > | null = null;

  public constructor(
    @inject(IContractFactoryType)
    protected contractFactory: IContractFactory,
  ) {}

  verifyEntity(
    domain: DomainName,
  ): ResultAsync<
    void,
    BlockchainProviderError | UninitializedError | SiftContractError
  > {
    return this.getSiftContract().andThen((contract) => {
      return contract.verifyEntity(domain);
    });
  }

  maliciousEntity(
    domain: DomainName,
  ): ResultAsync<
    void,
    BlockchainProviderError | UninitializedError | SiftContractError
  > {
    return this.getSiftContract().andThen((contract) => {
      return contract.maliciousEntity(domain);
    });
  }

  checkEntity(
    domain: DomainName,
  ): ResultAsync<
    EScamFilterStatus,
    BlockchainProviderError | UninitializedError | SiftContractError
  > {
    return this.getSiftContract().andThen((contract) => {
      console.log("siftEntity: ", contract);
      return contract.checkEntity(domain).map((siftStatus) => {
        console.log("siftStatus: ", siftStatus);
        return siftStatus as EScamFilterStatus;
      });
    });
  }

  protected getSiftContract(): ResultAsync<
    ISiftContract,
    BlockchainProviderError | UninitializedError
  > {
    if (this.siftContract == null) {
      this.siftContract = this.contractFactory.factorySiftContract();
    }
    return this.siftContract;
  }
}
