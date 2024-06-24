import {
  EVMContractAddress,
  BlockchainCommonErrors,
  FarcasterIdRegistryContractError,
  FarcasterId,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";
import { ResultAsync, errAsync, okAsync } from "neverthrow";

import { BaseContract } from "@contracts-sdk/implementations/BaseContract.js";
import { IEthersContractError } from "@contracts-sdk/implementations/BlockchainErrorMapper.js";
import { IFarcasterIdRegistryContract } from "@contracts-sdk/interfaces/index.js";
import { ContractsAbis } from "@contracts-sdk/interfaces/objects/index.js";

@injectable()
export class FarcasterIdRegistryContract
  extends BaseContract<FarcasterIdRegistryContractError>
  implements IFarcasterIdRegistryContract
{
  constructor(
    protected providerOrSigner: ethers.Provider | ethers.Signer,
    protected contractAddress: EVMContractAddress,
  ) {
    super(
      providerOrSigner,
      contractAddress,
      ContractsAbis.FarcasterIdRegistryAbi.abi,
    );
  }

  public idOf(
    ownerAddress: EVMContractAddress,
  ): ResultAsync<
    FarcasterId,
    FarcasterIdRegistryContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.ifOf(ownerAddress) as Promise<FarcasterId>,
      (e) => {
        return this.generateError(e, "Unable to call price()");
      },
    ).andThen((id) => {
      // If the returned value is 0n, then the owner address provided does not have an FID.
      if (id == 0n) {
        return errAsync(
          new FarcasterIdRegistryContractError(
            `No Farcaster Id found for ${ownerAddress} on the registry`,
            null,
            null,
          ),
        );
      }
      return okAsync(id);
    });
  }

  protected generateContractSpecificError(
    msg: string,
    e: IEthersContractError,
    transaction: ethers.Transaction | null,
  ): FarcasterIdRegistryContractError {
    return new FarcasterIdRegistryContractError(msg, e, transaction);
  }
}
