import {
  BlockchainCommonErrors,
  EVMAccountAddress,
  FarcasterIdGatewayContractError,
  Signature,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { IBaseContract } from "../IBaseContract";

import {
  ContractOverrides,
  WrappedTransactionResponse,
} from "@contracts-sdk/index";

export interface IFarcasterIdGatewayContract extends IBaseContract {
  /**
   * @notice Calculate the total price to register, equal to 1 storage unit.
   *
   * @return Total price in wei.
   */
  price(): ResultAsync<
    bigint,
    FarcasterIdGatewayContractError | BlockchainCommonErrors
  >;

  /**
   * @notice Calculate the total price to register, including additional storage.
   *
   * @param extraStorage Number of additional storage units to rent.
   *
   * @return Total price in wei.
   */
  priceWithExtraStorage(
    extraStorage: bigint,
  ): ResultAsync<
    bigint,
    FarcasterIdGatewayContractError | BlockchainCommonErrors
  >;

  /**
   * @notice Register a new Farcaster ID (fid) to the caller. The caller must not have an fid.
   *
   * @param recovery Address which can recover the fid. Set to zero to disable recovery.
   *
   * @return fid registered FID.
   */
  register(
    recoveryAddress: EVMAccountAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | FarcasterIdGatewayContractError
  >;

  /**
   * @notice Register a new Farcaster ID (fid) to the caller and rent additional storage.
   *         The caller must not have an fid.
   *
   * @param recovery     Address which can recover the fid. Set to zero to disable recovery.
   * @param extraStorage Number of additional storage units to rent.
   *
   * @return fid registered FID.
   */
  registerWithExtraStorage(
    recoveryAddress: EVMAccountAddress,
    extraStorage: bigint,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | FarcasterIdGatewayContractError
  >;

  /**
   * @notice Register a new Farcaster ID (fid) to any address. A signed message from the address
   *         must be provided which approves both the to and the recovery. The address must not
   *         have an fid.
   *
   * @param to       Address which will own the fid.
   * @param recovery Address which can recover the fid. Set to zero to disable recovery.
   * @param deadline Expiration timestamp of the signature.
   * @param sig      EIP-712 Register signature signed by the to address.
   *
   * @return fid registered FID.
   */
  registerFor(
    ownerAddress: EVMAccountAddress,
    recoveryAddress: EVMAccountAddress,
    deadline: UnixTimestamp,
    signature: Signature,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    FarcasterIdGatewayContractError | BlockchainCommonErrors
  >;

  /**
   * @notice Register a new Farcaster ID (fid) to any address and rent additional storage.
   *         A signed message from the address must be provided which approves both the to
   *         and the recovery. The address must not have an fid.
   *
   * @param to           Address which will own the fid.
   * @param recovery     Address which can recover the fid. Set to zero to disable recovery.
   * @param deadline     Expiration timestamp of the signature.
   * @param sig          EIP-712 Register signature signed by the to address.
   * @param extraStorage Number of additional storage units to rent.
   *
   * @return fid registered FID.
   */
  registerForWithExtraStorage(
    ownerAddress: EVMAccountAddress,
    recoveryAddress: EVMAccountAddress,
    deadline: UnixTimestamp,
    signature: Signature,
    extraStorage: bigint,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    FarcasterIdGatewayContractError | BlockchainCommonErrors
  >;
}
