import {
  BlockchainProviderError,
  EthereumAccountAddress,
  EthereumContractAddress,
  UninitializedError,
  ConsentToken,
  ConsentContractError,
} from "@snickerdoodlelabs/objects";
import { IConsentContract } from "@snickerdoodlelabs/contracts-sdk";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import {
  IBlockchainProvider,
  IBlockchainProviderType,
  IContextProvider,
  IContextProviderType,
  ILogUtils,
  ILogUtilsType,
} from "@core/interfaces/utilities";
import { IConsentContractRepository } from "@core/interfaces/data";
import {
  IInsightPlatformRepository,
  IInsightPlatformRepositoryType,
} from "@core/interfaces/data";
import {
  IConsentContractFactoryType,
  IConsentContractFactory,
} from "@core/interfaces/utilities/factory";

@injectable()
export class ConsentContractRepository implements IConsentContractRepository {
  protected consentContracts: Map<EthereumContractAddress, IConsentContract> =
    new Map();

  public constructor(
    @inject(IInsightPlatformRepositoryType)
    protected insightPlatformRepo: IInsightPlatformRepository,
    @inject(IBlockchainProviderType)
    protected blockchainProvider: IBlockchainProvider,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IConsentContractFactoryType)
    protected consentContractFactory: IConsentContractFactory,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public initializeConsentContracts(): ResultAsync<
    void,
    BlockchainProviderError | UninitializedError
  > {
    return this.insightPlatformRepo
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
  }

  public getConsentTokens(
    consentContractAddress: EthereumContractAddress,
    ownerAddress: EthereumAccountAddress,
  ): ResultAsync<ConsentToken[], ConsentContractError> {
    const consentContract = this.consentContracts.get(consentContractAddress);

    if (consentContract == null) {
      this.logUtils.warning(
        `Consent contract not found, address: ${consentContractAddress}`,
      );
      return okAsync([]);
    }
    return consentContract.getConsentTokensOfAddress(ownerAddress);
  }

  public isAddressOptedIn(
    consentContractAddress: EthereumContractAddress,
    address: EthereumAccountAddress,
  ): ResultAsync<boolean, ConsentContractError> {
    const consentContract = this.consentContracts.get(consentContractAddress);

    if (consentContract == null) {
      this.logUtils.warning(
        `Consent contract not found, address: ${consentContractAddress}`,
      );
      return okAsync(false);
    }

    return consentContract.balanceOf(address).map((numberOfTokens) => {
      return numberOfTokens > 0;
    });
  }
}
