import {
  ConsentContract,
  IConsentContract,
  ICrumbsContract,
  CrumbsContract,
} from "@snickerdoodlelabs/contracts-sdk";
import {
  BlockchainProviderError,
  EVMContractAddress,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import {
  IBlockchainProvider,
  IBlockchainProviderType,
  IConfigProvider,
  IConfigProviderType,
} from "@core/interfaces/utilities";
import { IContractFactory } from "@core/interfaces/utilities/factory";

@injectable()
export class ContractFactory implements IContractFactory {
  public constructor(
    @inject(IBlockchainProviderType)
    protected blockchainProvider: IBlockchainProvider,
    @inject(IConfigProviderType)
    protected configProvider: IConfigProvider,
  ) {}

  public factoryConsentContracts(
    consentContractAddresses: EVMContractAddress[],
  ): ResultAsync<
    IConsentContract[],
    BlockchainProviderError | UninitializedError
  > {
    return this.blockchainProvider
      .getControlProvider()
      .andThen((provider) => {
        return ResultUtils.combine(
          consentContractAddresses.map((consentContractAddress) => {
            return okAsync(
              new ConsentContract(provider, consentContractAddress),
            );
          }),
        );
      })
      .map((val) => val);
  }

  public factoryCrumbsContract(): ResultAsync<
    ICrumbsContract,
    BlockchainProviderError | UninitializedError
  > {
    return ResultUtils.combine([
      this.blockchainProvider.getControlProvider(),
      this.configProvider.getConfig(),
    ]).map(([provider, config]) => {
      return new CrumbsContract(
        provider,
        config.controlChainInformation.crumbsContractAddress,
      );
    });
  }
}
