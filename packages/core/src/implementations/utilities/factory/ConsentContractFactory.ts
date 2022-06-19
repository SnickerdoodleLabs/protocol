import {
  ConsentContract,
  IConsentContract,
} from "@snickerdoodlelabs/contracts-sdk";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import {
  IBlockchainProvider,
  IBlockchainProviderType,
} from "@core/interfaces/utilities";
import { IConsentContractFactory } from "@core/interfaces/utilities/factory";
import { ResultUtils } from "neverthrow-result-utils";
import {
  BlockchainProviderError,
  EthereumContractAddress,
  UninitializedError,
} from "@snickerdoodlelabs/objects";

@injectable()
export class ConsentContractFactory implements IConsentContractFactory {
  public constructor(
    @inject(IBlockchainProviderType)
    protected blockchainProvider: IBlockchainProvider,
  ) {}

  public factoryConsentContracts(
    consentContractAddresses: EthereumContractAddress[],
  ): ResultAsync<
    IConsentContract[],
    BlockchainProviderError | UninitializedError
  > {
    return this.blockchainProvider
      .getDataWalletSigner()
      .andThen((signer) => {
        return ResultUtils.combine(
          consentContractAddresses.map((consentContractAddress) => {
            return okAsync(new ConsentContract(signer, consentContractAddress));
          }),
        );
      })
      .map((val) => val);
  }
}
