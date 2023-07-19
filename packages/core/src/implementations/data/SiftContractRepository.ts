import { ISiftContractRepository } from "@core/interfaces/data/index.js";
import {
  IContractFactory,
  IContractFactoryType,
} from "@core/interfaces/utilities/factory/index.js";
import {
  ISiftContract,
  WrappedTransactionResponse,
} from "@snickerdoodlelabs/contracts-sdk";
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
export class SiftContractRepository implements ISiftContractRepository {
  protected siftContract: ResultAsync<
    ISiftContract,
    BlockchainProviderError | UninitializedError
  > | null = null;

  public constructor(
    @inject(IContractFactoryType)
    protected contractFactory: IContractFactory,
  ) {}

  verifyURL(
    domain: DomainName,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainProviderError | UninitializedError | SiftContractError
  > {
    return this.getSiftContract().andThen((contract) => {
      return contract.verifyURL(domain);
    });
  }

  maliciousURL(
    domain: DomainName,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainProviderError | UninitializedError | SiftContractError
  > {
    return this.getSiftContract().andThen((contract) => {
      return contract.maliciousURL(domain);
    });
  }

  checkURL(
    domain: DomainName,
  ): ResultAsync<
    EScamFilterStatus,
    BlockchainProviderError | UninitializedError | SiftContractError
  > {
    return this.getSiftContract().andThen((contract) => {
      return contract.checkURL(domain).map((url) => {
        return url.split("/").pop() as EScamFilterStatus;
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
