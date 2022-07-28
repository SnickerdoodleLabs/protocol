import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import { IConsentContract } from "@snickerdoodlelabs/contracts-sdk";
import {
  BlockchainProviderError,
  EVMAccountAddress,
  EVMContractAddress,
  UninitializedError,
  ConsentToken,
  ConsentContractError,
  AjaxError,
  ConsentContractRepositoryError,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import {
  IConsentContractRepository,
  IInsightPlatformRepository,
  IInsightPlatformRepositoryType,
} from "@core/interfaces/data";
import {
  IBlockchainProvider,
  IBlockchainProviderType,
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities";
import {
  IContractFactoryType,
  IContractFactory,
} from "@core/interfaces/utilities/factory";

@injectable()
export class ConsentContractRepository implements IConsentContractRepository {
  protected consentContracts: Map<EVMContractAddress, IConsentContract> =
    new Map();

  protected consentContractsPromise: ResultAsync<
    void,
    BlockchainProviderError | UninitializedError | AjaxError
  > | null;

  public constructor(
    @inject(IInsightPlatformRepositoryType)
    protected insightPlatformRepo: IInsightPlatformRepository,
    @inject(IBlockchainProviderType)
    protected blockchainProvider: IBlockchainProvider,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IContractFactoryType)
    protected consentContractFactory: IContractFactory,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {
    this.consentContractsPromise = null;
  }

  // I think this method is broken and unnecessary now. I don't think there is a
  // need to go to the insight platform for this.
  public initializeConsentContracts(): ResultAsync<
    void,
    BlockchainProviderError | UninitializedError | AjaxError
  > {
    if (this.consentContractsPromise != null) {
      return this.consentContractsPromise;
    }

    this.consentContractsPromise = this.insightPlatformRepo
      .getBusinessConsentContracts()
      .andThen((businessConsentContracts) => {
        return this.consentContractFactory
          .factoryConsentContracts(
            businessConsentContracts.map(
              (businessConsentContract) =>
                businessConsentContract.contractAddress,
            ),
          )
          .map((contracts) => {
            contracts.forEach((contract, index) => {
              this.consentContracts.set(
                businessConsentContracts[index].contractAddress,
                contract,
              );
            });
          });
      });

    return this.consentContractsPromise;
  }

  public getConsentTokens(
    consentContractAddress: EVMContractAddress,
    ownerAddress: EVMAccountAddress,
  ): ResultAsync<
    ConsentToken[],
    | ConsentContractError
    | ConsentContractRepositoryError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
  > {
    return this.getConsentContract(consentContractAddress).andThen(
      (consentContract) => {
        return consentContract.getConsentTokensOfAddress(ownerAddress);
      },
    );
  }

  public isAddressOptedIn(
    consentContractAddress: EVMContractAddress,
    address?: EVMAccountAddress,
  ): ResultAsync<
    boolean,
    | ConsentContractError
    | ConsentContractRepositoryError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
  > {
    return ResultUtils.combine([
      this.consentContractFactory.factoryConsentContracts([
        consentContractAddress,
      ]),
      this.contextProvider.getContext(),
    ])
      .andThen(([[consentContract], context]) => {
        // We will use the data wallet address if another address is not provided
        if (address == null) {
          if (context.dataWalletAddress == null) {
            return errAsync(
              new UninitializedError(
                "No data wallet address provided and core uninitialized in isAddressOptedIn",
              ),
            );
          }
          address = EVMAccountAddress(context.dataWalletAddress);
        }
        return consentContract.balanceOf(address);
      })
      .map((numberOfTokens) => {
        return numberOfTokens > 0;
      });
  }

  public getConsentContracts(): ResultAsync<
    Map<EVMContractAddress, IConsentContract>,
    | ConsentContractRepositoryError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
  > {
    if (this.consentContractsPromise == null) {
      return errAsync(new UninitializedError());
    }

    return this.consentContractsPromise.andThen(() => {
      return okAsync(this.consentContracts);
    });
  }

  protected getConsentContract(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    IConsentContract,
    | ConsentContractRepositoryError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
  > {
    if (this.consentContractsPromise == null) {
      return errAsync(new UninitializedError());
    }

    return this.consentContractsPromise.andThen(() => {
      const consentContract = this.consentContracts.get(consentContractAddress);

      if (consentContract == null) {
        return errAsync(
          new ConsentContractRepositoryError(
            `Consent contract not found, address: ${consentContractAddress}`,
          ),
        );
      }

      return okAsync(consentContract);
    });
  }
}
