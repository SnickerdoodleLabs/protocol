import { KEY_REGISTRY_ADDRESS } from "@farcaster/hub-nodejs";
import {
  EVMContractAddress,
  BlockchainCommonErrors,
  FarcasterKeyRegistryContractError,
  FarcasterUserId,
  EFarcasterKeyState,
  ED25519PublicKey,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";
import { ResultAsync, okAsync } from "neverthrow";

import { BaseContract } from "@contracts-sdk/implementations/BaseContract.js";
import { IEthersContractError } from "@contracts-sdk/implementations/BlockchainErrorMapper.js";
import { IFarcasterKeyRegistryContract } from "@contracts-sdk/interfaces/index.js";
import { ContractsAbis } from "@contracts-sdk/interfaces/objects/index.js";

@injectable()
export class FarcasterKeyRegistryContract
  extends BaseContract<FarcasterKeyRegistryContractError>
  implements IFarcasterKeyRegistryContract
{
  constructor(protected providerOrSigner: ethers.Provider | ethers.Signer) {
    super(
      providerOrSigner,
      EVMContractAddress(KEY_REGISTRY_ADDRESS),
      ContractsAbis.FarcasterKeyRegistryAbi.abi,
    );
  }

  public totalKeys(
    fid: FarcasterUserId,
    keyState: EFarcasterKeyState,
  ): ResultAsync<
    bigint,
    FarcasterKeyRegistryContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.totalKeys(fid, keyState) as Promise<bigint>,
      (e) => {
        return this.generateError(e, "Unable to call totalKeys()");
      },
    );
  }

  public keysOf(
    fid: FarcasterUserId,
    keyState: EFarcasterKeyState,
  ): ResultAsync<
    ED25519PublicKey[],
    FarcasterKeyRegistryContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.keysOf(fid, keyState) as Promise<ED25519PublicKey[]>,
      (e) => {
        return this.generateError(e, "Unable to call keysOf()");
      },
    );
  }

  protected generateContractSpecificError(
    msg: string,
    e: IEthersContractError,
    transaction: ethers.Transaction | null,
  ): FarcasterKeyRegistryContractError {
    return new FarcasterKeyRegistryContractError(msg, e, transaction);
  }
}
