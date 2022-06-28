import { IConsentContract } from "@snickerdoodlelabs/contracts-sdk";
import {
  BlockchainProviderError,
  EthereumAccountAddress,
  EthereumContractAddress,
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
  ILogUtils,
  ILogUtilsType,
} from "@core/interfaces/utilities";
import {
  IConsentContractFactoryType,
  IConsentContractFactory,
} from "@core/interfaces/utilities/factory";

@injectable()
export class ConsentContractRepository implements IConsentContractRepository {
  protected consentContracts: Map<EthereumContractAddress, IConsentContract> =
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
    @inject(IConsentContractFactoryType)
    protected consentContractFactory: IConsentContractFactory,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {
    this.consentContractsPromise = null;
  }

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
    consentContractAddress: EthereumContractAddress,
    ownerAddress: EthereumAccountAddress,
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
    consentContractAddress: EthereumContractAddress,
    address?: EthereumAccountAddress,
  ): ResultAsync<
    boolean,
    | ConsentContractError
    | ConsentContractRepositoryError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
  > {
    return ResultUtils.combine([
      this.getConsentContract(consentContractAddress),
      this.contextProvider.getContext(),
    ])
      .andThen(([consentContract, context]) => {
        // We will use the data wallet address if another address is not provided
        if (address == null) {
          if (context.dataWalletAddress != null) {
            address = EthereumAccountAddress(context.dataWalletAddress);
          }
          return errAsync(
            new UninitializedError(
              "No data wallet address provided and core uninitialized in isAddressOptedIn",
            ),
          );
        }
        return consentContract.balanceOf(address);
      })
      .map((numberOfTokens) => {
        return numberOfTokens > 0;
      });
  }




  public getConsentContracts(): ResultAsync<
    Map<EthereumContractAddress, IConsentContract>,
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
    consentContractAddress: EthereumContractAddress,
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
