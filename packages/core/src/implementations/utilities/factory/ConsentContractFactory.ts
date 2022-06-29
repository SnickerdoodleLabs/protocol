import {
  ConsentContract,
  IConsentContract,
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
} from "@core/interfaces/utilities";
import { IConsentContractFactory } from "@core/interfaces/utilities/factory";

@injectable()
export class ConsentContractFactory implements IConsentContractFactory {
  public constructor(
    @inject(IBlockchainProviderType)
    protected blockchainProvider: IBlockchainProvider,
  ) { }

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
}
