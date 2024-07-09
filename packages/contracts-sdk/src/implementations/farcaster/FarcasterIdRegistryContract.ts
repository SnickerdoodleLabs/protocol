import { ID_REGISTRY_ADDRESS } from "@farcaster/hub-nodejs";
import {
  EVMContractAddress,
  BlockchainCommonErrors,
  FarcasterIdRegistryContractError,
  FarcasterUserId,
  EVMAccountAddress,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";
import { ResultAsync, okAsync } from "neverthrow";

import { BaseContract } from "@contracts-sdk/implementations/BaseContract.js";
import { IEthersContractError } from "@contracts-sdk/implementations/BlockchainErrorMapper.js";
import { IFarcasterIdRegistryContract } from "@contracts-sdk/interfaces/index.js";
import { ContractsAbis } from "@contracts-sdk/interfaces/objects/index.js";

@injectable()
export class FarcasterIdRegistryContract
  extends BaseContract<FarcasterIdRegistryContractError>
  implements IFarcasterIdRegistryContract
{
  constructor(protected providerOrSigner: ethers.Provider | ethers.Signer) {
    super(
      providerOrSigner,
      EVMContractAddress(ID_REGISTRY_ADDRESS),
      ContractsAbis.FarcasterIdRegistryAbi.abi,
    );
  }

  public idOf(
    ownerAddress: EVMAccountAddress,
  ): ResultAsync<
    FarcasterUserId | null,
    FarcasterIdRegistryContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.idOf(ownerAddress) as Promise<FarcasterUserId>,
      (e) => {
        return this.generateError(e, "Unable to call idOf()");
      },
    ).andThen((id) => {
      // If the returned value is 0, then the owner address provided does not have an FID, return null
      if (id == 0) {
        return okAsync(null);
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
