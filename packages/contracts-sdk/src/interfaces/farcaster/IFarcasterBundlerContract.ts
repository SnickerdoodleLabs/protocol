import {
  BlockchainCommonErrors,
  FarcasterBundlerContractError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import {
  ContractOverrides,
  WrappedTransactionResponse,
  RegistrationParams,
  FarcasterBundlerSignerParams,
} from "@contracts-sdk/index.js";
import { IFarcasterBaseContract } from "@contracts-sdk/interfaces/farcaster/IFarcasterBaseContract.js";

export interface IFarcasterBundlerContract
  extends IFarcasterBaseContract<FarcasterBundlerContractError> {
  /**
   * @notice Calculate the total price of a registration.
   *
   * @param extraStorage Number of additional storage units to rent. All registrations include 1
   *                     storage unit, but additional storage can be rented at registration time.
   *
   * @return Total price in wei.
   *
   */
  price(
    extraStorage: bigint,
  ): ResultAsync<
    bigint,
    FarcasterBundlerContractError | BlockchainCommonErrors
  >;

  /**
   * @notice Register an fid, add one or more signers, and rent storage in a single transaction.
   *
   * @param registerParams Struct containing register parameters: to, recovery, deadline, and signature.
   * @param signerParams   Array of structs containing signer parameters: keyType, key, metadataType,
   *                       metadata, deadline, and signature.
   * @param extraStorage   Number of additional storage units to rent. (fid registration includes 1 unit).
   *
   */
  register(
    registrationParams: RegistrationParams,
    signerParams: FarcasterBundlerSignerParams[],
    extraStorage: bigint,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    FarcasterBundlerContractError | BlockchainCommonErrors
  >;
}

export const IFarcasterBundlerContractType = Symbol.for(
  "IFarcasterBundlerContract",
);
