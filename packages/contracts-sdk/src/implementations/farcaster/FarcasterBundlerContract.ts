import { BUNDLER_ADDRESS } from "@farcaster/hub-nodejs";
import {
  EVMContractAddress,
  BlockchainCommonErrors,
  FarcasterBundlerContractError,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { BaseContract } from "@contracts-sdk/implementations/BaseContract.js";
import { IEthersContractError } from "@contracts-sdk/implementations/BlockchainErrorMapper.js";
import {
  ContractOverrides,
  IFarcasterBundlerContract,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/index.js";
import { RegistrationParams } from "@contracts-sdk/interfaces/objects/farcaster/RegistrationParams.js";
import {
  ContractsAbis,
  FarcasterBundlerSignerParams,
} from "@contracts-sdk/interfaces/objects/index.js";
@injectable()
export class FarcasterBundlerContract
  extends BaseContract<FarcasterBundlerContractError>
  implements IFarcasterBundlerContract
{
  constructor(protected providerOrSigner: ethers.Provider | ethers.Signer) {
    super(
      providerOrSigner,
      EVMContractAddress(BUNDLER_ADDRESS),
      ContractsAbis.FarcasterBundlerAbi.abi,
    );
  }

  public price(
    extraStorage: bigint,
  ): ResultAsync<
    bigint,
    FarcasterBundlerContractError | BlockchainCommonErrors
  > {
    // https://optimistic.etherscan.io/address/0x00000000fc04c910a0b5fea33b03e0447ad0b0aa#code#F1#L60

    return ResultAsync.fromPromise(
      this.contract.price(extraStorage) as Promise<bigint>,
      (e) => {
        return this.generateError(e, "Unable to call price()");
      },
    );
  }

  public register(
    registrationParams: RegistrationParams,
    signerParams: FarcasterBundlerSignerParams[],
    extraStorage: bigint,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    FarcasterBundlerContractError | BlockchainCommonErrors
  > {
    return this.assureSigner("register").andThen(() => {
      return this.writeToContract(
        "register",
        [registrationParams, signerParams, extraStorage],
        overrides,
      );
    });
  }

  protected generateContractSpecificError(
    msg: string,
    e: IEthersContractError,
    transaction: ethers.Transaction | null,
  ): FarcasterBundlerContractError {
    return new FarcasterBundlerContractError(msg, e, transaction);
  }
}
