import { ICrumbsRepository } from "@core/interfaces/data";
import { ISiftContractRepository } from "@core/interfaces/data/ISiftContractRepository";
import {
  IConfigProvider,
  IConfigProviderType,
} from "@core/interfaces/utilities";
import {
  IContractFactory,
  IContractFactoryType,
} from "@core/interfaces/utilities/factory";
import { ISiftContract } from "@extension-onboarding/packages/contracts-sdk/src/interfaces/ISiftContract";
import {
  IAxiosAjaxUtilsType,
  IAxiosAjaxUtils,
  ICryptoUtils,
  ICryptoUtilsType,
} from "@snickerdoodlelabs/common-utils";
import { ICrumbsContract } from "@snickerdoodlelabs/contracts-sdk";
import {
  LanguageCode,
  BlockchainProviderError,
  EVMAccountAddress,
  AESEncryptedString,
  UninitializedError,
  SiftContractError,
  DomainName,
  TokenUri,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

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
    void,
    BlockchainProviderError | UninitializedError | SiftContractError
  > {
    return this.getSiftContract().andThen((contract) => {
      return contract.verifyURL(domain);
    });
  }

  maliciousURL(
    domain: DomainName,
  ): ResultAsync<
    void,
    BlockchainProviderError | UninitializedError | SiftContractError
  > {
    return this.getSiftContract().andThen((contract) => {
      return contract.maliciousURL(domain);
    });
  }

  checkURL(
    domain: DomainName,
  ): ResultAsync<
    TokenUri,
    BlockchainProviderError | UninitializedError | SiftContractError
  > {
    return this.getSiftContract().andThen((contract) => {
      // Retrieve the crumb id or token id mapped to the address
      // returns 0 if non existent
      return contract.checkURL(domain);
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
